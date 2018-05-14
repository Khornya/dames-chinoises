///(function() { // IIFE pour éviter les variables globales
  var isInTestMode = false; // true pour lancer un test
  var testName = 'game';

var socket = io();

var numPlayers;
var numColors;
var COLORS;
var gameId = parseInt(document.getElementById("gameId").value,10);
var role = document.getElementById("role").value;

  // ********************************** configuration nombre de joueur nombre de couleur (à récupérer via PHP) ***************************

if (role === "host") {
  numPlayers = parseInt(document.getElementById("nombre_joueurs").value,10);   // si numPlayers=2, il faut définir numColors (1, 2 ou 3) sinon numColors= 2 pour 3 joueurs et 1 pour (4,6) joueur (par defaut)
  numColors = parseInt(document.getElementById("colors").value,10);
  COLORS = { // attribution des couleurs à chaque joueur
    2: {
      1: [[1],[2]],
      2: [[1,3],[2,4]],
      3: [[1,3,5],[2,4,6]]
    },
    3: { 2: [[1,3],[4,5],[2,6]] },
    4: { 1: [[1],[2],[3],[4]] },
    6: { 1: [[1],[3],[6],[2],[4],[5]] }
  }[numPlayers][numColors];
  isPlayedByIa = initArray(numPlayers, 0, false);
  for (var i=1; i<=numPlayers; i++) {
    if (document.getElementById("IA"+i).value!== "")
      isPlayedByIa[i-1] = true;
  }
  socket.emit('create game', {
    numPlayers: numPlayers,
    numColors: numColors,
    COLORS: COLORS,
    player: document.getElementById("player1").value,
    gameId: gameId,
    isPlayedByIa: isPlayedByIa
  } );
}
else if (role === "guest"){
  socket.emit('join game', { gameId: gameId, player: document.getElementById("player1").value });
}


  // ******************************************* création du plateau de jeu ****************************************

  var player;  // joueur symbolique
  var gameOver; // partie terminée ?
  var startCell; // case départ pour un mouvement // pas de couples en JS
  var playedColor; // couleur jouée
  var gameState; // matrice pour les couleurs finies
  var gameBoard; // matrice pour le plateau // à virer
  var images; // matrice pour les images
  var history; // liste qui sauvgarde pour chaque joueur le dernier chemin empreinté
  var PLAYERS = [];
  var playerNames = [];
  var Time=500;
  var isPlayedByIa;

  var Sounds = {
    jump : new Sound("sounds/click.mp3"),
    fail : new Sound("sounds/fail.mp3"),
    win : new Sound("sounds/win.mp3")
  }

  var Muted = false; // etat du son

  document.getElementById("muteButton").addEventListener('click', function(e) {
    Muted = !Muted;
    e.currentTarget.src = Muted? "images/mute.png" : "images/unmute.png";
  });

  document.getElementById("rules").addEventListener('click', function(e) {
    var modal = document.getElementById("rulesModal");
    var span = document.getElementsByClassName("close")[1]; // Get the <span> element that closes the modal
    modal.style.display = "block";
    span.onclick = function() {                // When the user clicks on <span> (x), close the modal
        modal.style.display = "none";
    }
    window.onclick = function(event) {         // When the user clicks anywhere outside of the modal, close it
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
  });


  // *********************************************** fonctions de jeu ************************************************

  // initialise la matrice pour le plateau de jeu
  function initGameBoard() { // partager avec serveur ?
    var matrice = initArray(17,25,false);
    for (var R=0; R<4; R++) { // R pour row, C pour column
      for (var C=12-R; C<=12+R; C+=2) {
        matrice[R][C] = 1;
        matrice[16-R][C] = 2;
      }
    }
    for (var R=4; R<8; R++) {
      for (var C=12-R; C<=12+R; C+=2) {
        matrice[R][C] = -1;
        matrice[16-R][C] = -1;
      }
      for (var C=R-4; C<=10-R; C+=2) {
        matrice[R][C] = 3;
        matrice[16-R][24-C] = 4;
        matrice[R][24-C] = 5;;
        matrice[16-R][C] = 6;
      }
    }
    for (var C=4; C<21; C+=2) { matrice[8][C] = -1 }
    return matrice;
  }

  // crée le plateau de jeu
  function createGameBoard(matrice) {
    var board = initArray(17,25,false);
    var line, cell;
    for (var R=0; R<17; R++) { // crée un div pour chaque ligne
      line = document.createElement('div');
      line.id = 'line'+R;
      line.className = 'line';
      document.getElementById('board').appendChild(line);
      for (var C=0; C<25; C++) { // crée un div pour chaque cellule
        if (matrice[R][C] !== false) {
          cell = createCell([R,C], matrice[R][C]);
          line.appendChild(cell);
          board[R][C] = cell.firstChild; // identité de chaque image
        }
      }
    }
    return board;
  }

  // crée une case
  function createCell(cell, color) {
    var div = document.createElement('div');
    div.classList.add('cell');
    div.setAttribute('line', cell[0]);
    div.setAttribute('column', cell[1]);
    // ajoute l'image de base pour la case
    div.innerHTML = "<img alt='pion' src='images/pion" + color + ".png' />";
    // gère l'event 'click'
    div.addEventListener('click', play);
    return div;
  }

  // fonction pour recommencer le jeu
  function init() {

  }


  function restart(opt=1) {
    if (opt) {
      document.getElementById('myModal').style.display = "none";
    }
    updatePlayerFrames();
 }


  function refresh_board(gameBoard) { // a optimiser pour ne pas tester les cases en dehors de l'étoile
    for (var R=0; R<17; R++) {
      for (var C=0; C<25; C++) {
        if (images[R][C].src !== "images/pion" + gameBoard[R][C] + ".png")
          images[R][C].src = "images/pion" + gameBoard[R][C] + ".png"; }
    }
  }


  function move(path, playedColor, isAlreadyMoving) {
    var previous = path[0];
    var actuel = path[1];
    gameBoard[previous[0]][previous[1]] = -1;
    gameBoard[actuel[0]][actuel[1]] = playedColor;
    images[previous[0]][previous[1]].src = "images/pion-1.png";
    images[actuel[0]][actuel[1]].src = "images/pion" + playedColor + ".png";
    Sounds.jump.play();
    if (path.length > 2) {
      (function(path) {
        setTimeout(function(){
          move(path, playedColor, true);
        }, 500*(!isInTestMode)); // temps d'exécution réduit pour les tests
      })(path.slice(1));
    }
  }

function end_game(winner) {
        var modal = document.getElementById('myModal');
        var btn = document.getElementById("myBtn"); // Get the button that opens the modal
        var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
        var content = document.getElementById("modal_text");
        modal.style.display = "block";
        Sounds.win.play();
        content.innerHTML = PLAYERS[winner].name + " a gagné en " + PLAYERS[winner].score + " coups." ;
        span.onclick = function() {                // When the user clicks on <span> (x), close the modal
            modal.style.display = "none";
        }
        window.onclick = function(event) {         // When the user clicks anywhere outside of the modal, close it
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
}


  // constructeur pour la classe Player
  function Player(name, score, colors, number, frame) {
      this.name = name;
      this.score = score;
      this.colors = colors;
      this.number = number;
      this.frame = frame;

      this.updateScore = function() {
        this.score += 1;
  //      this.frame.children[1].innerHTML = ('score : ' + this.score);
      };

      this.createFrame = function() {  // crée un cadre pour les infos d'un joueur
          var frame = document.createElement('div');
          frame.className = 'player_info';
          frame.id = 'player' + this.number;
          var name = document.createElement('p');
          name.className = 'player_name';
          name.innerHTML = this.name;
          var score = document.createElement('p');
          score.className = 'player_score';
          score.innerHTML = ('score : ' + this.score);
          var colors = document.createElement('span');
          colors.className = 'player_colors';
          var code = '';
          for (var i=0, max=this.colors.length, color; i<max; i++) {
            color = this.colors[i];
             code += "<img class='imagetag' alt='color' src='images/pion" + color + ".png' />"
          }
          colors.innerHTML = code;
          frame.appendChild(name);
  //        frame.appendChild(score);
          frame.appendChild(colors);
          document.getElementById('left_panel').appendChild(frame);
          this.frame = frame;
        };
    }


 // se déclenche à chaque clic sur une case du plateau
function play(event) {
    if (gameOver) return;
    var R = parseInt(event.currentTarget.getAttribute('line'),10);
    var C = parseInt(event.currentTarget.getAttribute('column'),10);
    socket.emit('move request', { cell : [R,C] });
    }


  function updatePlayerFrames() {
    var player_frames = document.querySelectorAll('.player_info');
    for (var i=0, max=player_frames.length; i<max; i++) {
      if (player_frames[i].id === 'player' + (player+1)) {
        player_frames[i].firstChild.style.textDecoration = 'underline';
      }
      else {
        player_frames[i].firstChild.style.textDecoration = 'none';
      }
    }
  }

  function sendMessage(message, sound) {
    sound.play();
    alert(message);
  }

  function Sound(source) {
    this.sound = document.createElement("audio");
    this.sound.src = source;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      if (!Muted) this.sound.play();
    }
  }

  function initArray(lignes, colonnes, valeur) { // partager avec serveur ?
    var array = [];
    for (var i=0; i<lignes; i++) {
      if (colonnes) {
        array[i] = [];
        for (var j=0; j<colonnes; j++) {
          array[i][j] = valeur;
        }
      }
      else array[i] = valeur;
    }
    return array;
  }

    socket.on('connect', function() {
      console.log("socket id : ", this.id);
    })
    socket.on('select', function (data) {
      console.log("select : ", data);
      var R = data["cell"][0];
      var C = data["cell"][1];
      images[R][C].src = "images/pion" + gameBoard[R][C] + "vide.png";
    });
    socket.on('deselect', function (data) {
      console.log("deselect : ", data);
      var R = data["cell"][0];
      var C = data["cell"][1];
      images[R][C].src = "images/pion" + data["color"] + ".png";
    });
    socket.on('game error', function (data) {
      console.log("game error : ", data);
      sendMessage(data["message"], Sounds[data["sound"]]);
    });
    socket.on('move', function (data) {
      console.log("move : ", data);
      move(data["traject"], data["playedColor"], false);
    });
    socket.on('new turn', function (data) {
      console.log("new turn : ", data);
      player = data["player"];
      updatePlayerFrames();
    });
    socket.on('new game', function (data) {
      console.log("new game : ", data);
      numPlayers = data["numPlayers"];
      numColors = data["numColors"];
      COLORS = data["COLORS"];
      // myRole = data["myRole"]
      // ************************************************** tests automatisés *************************************************
      if (isInTestMode) {
        Tests[testName].run_test();
      }
      else {
        // init();
      }
    });
    socket.on('end game', function (data) {
      end_game(data["winner"]);
    });
    socket.on('game joined', function (data) {
      console.log("game joined : ", data);
      numPlayers = data["numPlayers"];
      numColors = data["numColors"];
      COLORS = data["COLORS"];
      // myRole = data["myRole"];
      // ************************************************** tests automatisés *************************************************

      if (isInTestMode) {
        Tests[testName].run_test();
      }
      else {
        // init();
      }
    });
    socket.on('game full', function (data) {
      console.log("game full : ", data);
      document.getElementById("joinGame").style.display = "none";
      isPlayedByIa = data["isPlayedByIa"];
      numPlayers = data["numPlayers"];
      n_colors = data["numColors"];
      COLORS = data["COLORS"];
      gameBoard = initGameBoard();
      images = createGameBoard(gameBoard);
      PLAYERS = data["PLAYERS"];
      for (var i=0, max=PLAYERS.length; i<max; i++) {
        PLAYERS[i] = new Player(PLAYERS[i].name, PLAYERS[i].score, PLAYERS[i].colors, PLAYERS[i].number);
        PLAYERS[i].createFrame();
      }
      player=0;
      startCell =  (0,0) ;
      gameOver = false;
      gameState = initArray(numPlayers, n_colors, false);
      history = initArray(numPlayers, 0, false);
      restart(0);
    });

//})();
