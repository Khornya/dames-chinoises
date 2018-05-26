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
  numPlayers = parseInt(document.getElementById("numPlayers").value,10);   // si numPlayers=2, il faut définir numColors (1, 2 ou 3) sinon numColors= 2 pour 3 joueurs et 1 pour (4,6) joueur (par defaut)
  numColors = parseInt(document.getElementById("numColors").value,10);
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
  var gameBoard; // matrice pour le plateau // à virer
  var images; // matrice pour les images
  var PLAYERS = [];
  var isPlayedByIa;

  var Sounds = {
    jump : new Sound("sounds/click.mp3"),
    fail : new Sound("sounds/fail.mp3"),
    win : new Sound("sounds/win.mp3")
  }

  var Muted = false; // etat du son

  document.getElementById("muteButton").addEventListener('click', function(event) {
    Muted = !Muted;
    event.currentTarget.src = Muted? "images/mute.png" : "images/unmute.png";
  });

  document.getElementById("rules").addEventListener('click', function(event) {
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
    for (var row=0; row<4; row++) {
      for (var col=12-row; col<=12+row; col+=2) {
        matrice[row][col] = 1;
        matrice[16-row][col] = 2;
      }
    }
    for (var row=4; row<8; row++) {
      for (var col=12-row; col<=12+row; col+=2) {
        matrice[row][col] = -1;
        matrice[16-row][col] = -1;
      }
      for (var col=row-4; col<=10-row; col+=2) {
        matrice[row][col] = 3;
        matrice[16-row][24-col] = 4;
        matrice[row][24-col] = 5;;
        matrice[16-row][col] = 6;
      }
    }
    for (var col=4; col<21; col+=2) { matrice[8][col] = -1 }
    return matrice;
  }

  // crée le plateau de jeu
  function createGameBoard(matrice) {
    var board = initArray(17,25,false);
    var line, cell;
    for (var row=0; row<17; row++) { // crée un div pour chaque ligne
      line = document.createElement('div');
      line.id = 'line'+row;
      line.className = 'line';
      document.getElementById('board').appendChild(line);
      for (var col=0; col<25; col++) { // crée un div pour chaque cellule
        if (matrice[row][col] !== false) {
          cell = createCell([row,col], matrice[row][col]);
          line.appendChild(cell);
          board[row][col] = cell.firstChild; // identité de chaque image
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


  function restart(option=1) {
    if (option) {
      document.getElementById('myModal').style.display = "none";
      socket.emit('restart request');
    }
    updatePlayerFrames();
 }


  function refreshBoard(gameBoard) { // a optimiser pour ne pas tester les cases en dehors de l'étoile
    for (var row=0; row<17; row++) {
      for (var col=0; col<25; col++) {
        if (images[row][col].src !== "images/pion" + gameBoard[row][col] + ".png")
          images[row][col].src = "images/pion" + gameBoard[row][col] + ".png"; }
    }
  }


  function move(path, playedColor) {
    var previous = path[0];
    var actual = path[1];
    gameBoard[previous[0]][previous[1]] = -1;
    gameBoard[actual[0]][actual[1]] = playedColor;
    images[previous[0]][previous[1]].src = "images/pion-1.png";
    images[actual[0]][actual[1]].src = "images/pion" + playedColor + ".png";
    Sounds.jump.play();
    if (path.length > 2) {
      (function(path) {
        setTimeout(function(){
          move(path, playedColor);
        }, 500*(!isInTestMode)); // temps d'exécution réduit pour les tests
      })(path.slice(1));
    }
  }

function endGame(winner, score) {
  var modal = document.getElementById('modal');
  // var button = document.getElementById("myBtn"); // Get the button that opens the modal
  var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
  var content = document.getElementById("modalText");
  var restartButton = document.getElementById("restartButton");
  modal.style.display = "block";
  Sounds.win.play();
  span.onclick = function() {                // When the user clicks on <span> (x), close the modal
      modal.style.display = "none";
  }
  window.onclick = function(event) {         // When the user clicks anywhere outside of the modal, close it
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
  if (typeof(winner) === 'undefined') {
    content.innerHTML = "Vous avez gagné par forfait.";
    restartButton.style.display = "none";
  }
  else {
    content.innerHTML = PLAYERS[winner].name + " a gagné en " + score + " coups." ;
    restartButton.style.display = "inline";
  }

}


  // constructeur pour la classe Player
  function Player(name, colors, number, frame) {
      this.name = name;
      this.colors = colors;
      this.number = number;
      this.frame = frame;

      this.createFrame = function() {  // crée un cadre pour les infos d'un joueur
          var frame = document.createElement('div');
          frame.className = 'playerInfo';
          frame.id = 'player' + this.number;
          var name = document.createElement('p');
          name.className = 'playerName';
          name.innerHTML = this.name;
          var score = document.createElement('p');
          score.className = 'playerScore';
          score.innerHTML = ('score : ' + this.score);
          var colors = document.createElement('span');
          colors.className = 'playerColors';
          var code = '';
          for (var i=0, max=this.colors.length, color; i<max; i++) {
            color = this.colors[i];
             code += "<img class='imagetag' alt='color' src='images/pion" + color + ".png' />"
          }
          colors.innerHTML = code;
          frame.appendChild(name);
          frame.appendChild(colors);
          document.getElementById('leftPanel').appendChild(frame);
          this.frame = frame;
        };
    }


 // se déclenche à chaque clic sur une case du plateau
function play(event) {
    var row = parseInt(event.currentTarget.getAttribute('line'),10);
    var col = parseInt(event.currentTarget.getAttribute('column'),10);
    socket.emit('move request', { cell : [row,col] });
    }


  function updatePlayerFrames() {
    var playerFrames = document.querySelectorAll('.playerInfo');
    for (var i=0, max=playerFrames.length; i<max; i++) {
      if (playerFrames[i].id === 'player' + (player+1)) {
        playerFrames[i].firstChild.style.textDecoration = 'underline';
      }
      else {
        playerFrames[i].firstChild.style.textDecoration = 'none';
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

  function initArray(lines, columns, value) { // partager avec serveur ?
    var array = [];
    for (var i=0; i<lines; i++) {
      if (columns) {
        array[i] = [];
        for (var j=0; j<columns; j++) {
          array[i][j] = value;
        }
      }
      else array[i] = value;
    }
    return array;
  }

    socket.on('connect', function() {
      console.log("socket id : ", this.id);
    })
    socket.on('select', function (data) {
      console.log("select : ", data);
      var row = data["cell"][0];
      var col = data["cell"][1];
      images[row][col].src = "images/pion" + gameBoard[row][col] + "vide.png";
    });
    socket.on('deselect', function (data) {
      console.log("deselect : ", data);
      var row = data["cell"][0];
      var col = data["cell"][1];
      images[row][col].src = "images/pion" + data["color"] + ".png";
    });
    socket.on('game error', function (data) {
      console.log("game error : ", data);
      sendMessage(data["message"], Sounds[data["sound"]]);
    });
    socket.on('move', function (data) {
      console.log("move : ", data);
      move(data["path"], data["playedColor"]);
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
    });
    socket.on('end game', function (data) {
      console.log('end game :', data);
      endGame(data["winner"], data["score"]);
    });
    socket.on('game joined', function (data) {
      console.log("game joined : ", data);
      numPlayers = data["numPlayers"];
      numColors = data["numColors"];
      COLORS = data["COLORS"];
    });
    socket.on('name error', function (data) {
      document.getElementById("player1").value = prompt("Ce nom est déjà pris, veuillez en choisir un nouveau :", data['name']);
      socket.emit('join game', { gameId: gameId, player: document.getElementById("player1").value });
    });
    socket.on('game full', function (data) {
      console.log("game full : ", data);
      document.getElementById("joinGame").style.display = "none";
      isPlayedByIa = data["isPlayedByIa"];
      numPlayers = data["numPlayers"];
      numColors = data["numColors"];
      COLORS = data["COLORS"];
      gameBoard = initGameBoard();
      images = createGameBoard(gameBoard);
      PLAYERS = data["PLAYERS"];
      for (var i=0, max=PLAYERS.length; i<max; i++) {
        PLAYERS[i] = new Player(PLAYERS[i].name, PLAYERS[i].colors, PLAYERS[i].number);
        PLAYERS[i].createFrame();
      }
      player=0;
      restart(0);
    });
    socket.on('player disconnecting', function (data) {
      console.log('player disconnecting :', data);
      alert(data['name'] + '(Joueur ' + (data['number']+1) + ') a été déconnecté.');
    });
    socket.on('restart game', function () {
      console.log('restart game');
      gameBoard = initGameBoard();
      refreshBoard(gameBoard);
      player = 0;
      updatePlayerFrames();
    });
//})();
