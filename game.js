///(function() { // IIFE pour éviter les variables globales
var isInTestMode = false; // variable pour activer le mode test - true pour lancer un test
var testName = 'game'; // variable pour selectionner le nom du test à lancer

var socket = io(); // crée une instance de io à partir de socket.io

var numPlayers; // nombre de joueurs
var numColors; // nombre de couleurs
var COLORS; // liste des couleurs de chaque joueur
var gameId = parseInt(document.getElementById("gameId").value,10); // numéro de la partie
var role = document.getElementById("role").value; // rôle du joueur - host ou guess

// ********************************** configuration nombre de joueurs nombre de couleurs ***************************

if (role === "host") { // si le joueur est host
  numPlayers = parseInt(document.getElementById("numPlayers").value,10); // on récupère le nombre de joueurs
  numColors = parseInt(document.getElementById("numColors").value,10); // on récupère le nombre de couleurs
  COLORS = { // on attribue les couleurs à chaque joueur
    2: { // deux joueurs
      1: [[1],[2]], // une couleur
      2: [[1,3],[2,4]], // deux couleurs
      3: [[1,3,5],[2,4,6]] // trois couleurs
    },
    3: { 2: [[1,3],[4,5],[2,6]] }, // trois joueurs deux couleurs
    4: { 1: [[1],[2],[3],[4]] }, // quatre joueurs une couleur
    6: { 1: [[1],[3],[6],[2],[4],[5]] } // six joueurs une couleur
  }[numPlayers][numColors];
  isPlayedByIa = initArray(numPlayers, 0, false); // on initialise l'array qui permet de savoir quel joueur est joué par l'IA
  for (var i=1; i<=numPlayers; i++) { // pour chaque joueur
    if (document.getElementById("IA"+i).value!== "") // si il est joué par l'IA
      isPlayedByIa[i-1] = true; // on attribue le joueur à l'IA
  }
  socket.emit('create game', { // on emet un message de création de partie au serveur
    numPlayers: numPlayers, // et on envoie les données correspondantes
    numColors: numColors,
    COLORS: COLORS,
    player: document.getElementById("player1").value,
    gameId: gameId,
    isPlayedByIa: isPlayedByIa
  } );
}
else if (role === "guest"){ // si le joueur est invité
  socket.emit('join game', { gameId: gameId, player: document.getElementById("player1").value }); // on emet un message pour rejoindre la partie au serveur
}


  // ******************************************* création du plateau de jeu ****************************************

  var player;  // joueur symbolique
  var gameBoard; // matrice pour le plateau // A ENLEVER
  var images; // matrice pour les images
  var PLAYERS = []; // array pour les instances de la classe Player
  var isPlayedByIa; // array qui permet de savoir quel joueur est joué par l'IA

  var Sounds = { // sons qui seront liés aux events
    jump : new Sound("sounds/click.mp3"),
    fail : new Sound("sounds/fail.mp3"),
    win : new Sound("sounds/win.mp3")
  }

  var Muted = false; // état du son

  document.getElementById("muteButton").addEventListener('click', function(event) { // si on clique sur le bouton on active ou désactive le son
    Muted = !Muted;
    event.currentTarget.src = Muted? "images/mute.png" : "images/unmute.png"; // et on change l'image en fonction de l'état
  });

  document.getElementById("rules").addEventListener('click', function(event) { // si on clique sur le lien pour voir les règles
    var modal = document.getElementById("rulesModal"); // on récupère le modal
    var span = document.getElementsByClassName("close")[1]; // on récupère le <span> qui ferme le modal
    modal.style.display = "block";  // on affiche le modal
    span.onclick = function() {                // si on clique sur le <span> on masque le modal
        modal.style.display = "none";
    }
    window.onclick = function(event) {         // si on clique en dehors on masque le modal
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
  });


  // *********************************************** fonctions de jeu ************************************************

  // initialise la matrice pour le plateau de jeu de 17 par 25 et on y attribue les valeurs (voir cahier des charges)
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

  // crée le plateau de jeu basé sur la matrice
  function createGameBoard(matrice) {
    var board = initArray(17,25,false);
    var line, cell;
    for (var row=0; row<17; row++) { // crée un div pour chaque ligne
      line = document.createElement('div');
      line.id = 'line'+row;
      line.className = 'line';
      document.getElementById('board').appendChild(line);
      for (var col=0; col<25; col++) { // crée chaque cellule
        if (matrice[row][col] !== false) {
          cell = createCell([row,col], matrice[row][col]);
          line.appendChild(cell);
          board[row][col] = cell.firstChild; // identité de chaque image
        }
      }
    }
    return board;
  }

  // création d'une case de coordonnée "cell" et de couleur "color"
  function createCell(cell, color) {
    var div = document.createElement('div'); // on crée un div pour la cellule
    div.classList.add('cell'); // on lui attribue la classe "cell"
    div.setAttribute('line', cell[0]); // on met la valeur des attributs "line" et "column"
    div.setAttribute('column', cell[1]);
    div.innerHTML = "<img alt='pion' src='images/pion" + color + ".png' />";     // on ajoute l'image de base pour la case
    div.addEventListener('click', play);     // on ajoute un event "click" qui déclenchera la fonction "play"
    return div;
  }


  function restart(option=1) { // fonction pour redémarrer une partie
    if (option) { // si une partie est déjà en cours
      document.getElementById('myModal').style.display = "none"; // on cache le modal
      socket.emit('restart request'); // on envoie un message "restart request" au serveur
    }
    updatePlayerFrames(); // on reinitialise les frames de joueurs
 }


  function refreshBoard(gameBoard) { // actualise l'affichage du plateau de jeu
    for (var row=0; row<17; row++) { // pour chaque ligne
      for (var col=0; col<25; col++) { // pour chaque colonne
        if (images[row][col].src !== "images/pion" + gameBoard[row][col] + ".png") // si l'image ne correspond pas
          images[row][col].src = "images/pion" + gameBoard[row][col] + ".png"; } // on change l'image
    }
  }


  function move(path, playedColor) { // fonction pour déplacer un pion de couleur "playedColor" selon le chemin "path"
    var previous = path[0]; // case de départ
    var actual = path[1]; // case suivante
    gameBoard[previous[0]][previous[1]] = -1; // on marque la case de départ à -1 pour indiquer qu'elle n'est plus occupée
    gameBoard[actual[0]][actual[1]] = playedColor; // on marque la case suivante avec la couleur jouée
    images[previous[0]][previous[1]].src = "images/pion-1.png"; // on actualise les images des cases de départ et suivante
    images[actual[0]][actual[1]].src = "images/pion" + playedColor + ".png";
    Sounds.jump.play(); // on joue le son
    if (path.length > 2) { // si il y a d'autres sauts à effectuer
      (function(path) { // appel la fonction move avec le reste du chemin dans 500 ms
        setTimeout(function(){
          move(path, playedColor);
        }, 500*(!isInTestMode)); // temps d'exécution réduit pour les tests
      })(path.slice(1));
    }
  }

function endGame(winner, score) { // fonction pour afficher la fin de la partie
  var modal = document.getElementById('modal'); // on sélectionne le modal
  var span = document.getElementsByClassName("close")[0]; 
  var content = document.getElementById("modalText");
  var restartButton = document.getElementById("restartButton");
  modal.style.display = "block";
  Sounds.win.play();
  span.onclick = function() {                
      modal.style.display = "none";
  }
  window.onclick = function(event) {         
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
  if (typeof(winner) === 'undefined') { // si un joueur quitte la partie avant la fin
    content.innerHTML = "Vous avez gagné par forfait.";
    restartButton.style.display = "none";
  }
  else { // sinon on affiche le gagnant et son score
    content.innerHTML = PLAYERS[winner].name + " a gagné en " + score + " coups." ;
    restartButton.style.display = "inline";
  }

}


  function Player(name, colors, number, frame) {  // constructeur pour la classe Player
      this.name = name;
      this.colors = colors;
      this.number = number;
      this.frame = frame;

      this.createFrame = function() {  // crée un cadre pour les infos d'un joueur
          var frame = document.createElement('div'); // on crée un div
          frame.className = 'playerInfo'; // on attribue la classe 
          frame.id = 'player' + this.number; // on attribue l'ID avec le numéro du joueur
          var name = document.createElement('p'); // on crée un paragraphe 
          name.className = 'playerName'; // on attribue la classe playerName
          name.innerHTML = this.name; // on affiche le nom dans le paragraphe
          var score = document.createElement('p'); // on crée un paragraphe pour le score
          score.className = 'playerScore'; // on attribue la classe playerScore
          score.innerHTML = ('score : ' + this.score); // on affiche le score dans le paragraphe
          var colors = document.createElement('span'); // on crée un span
          colors.className = 'playerColors'; // on attribue la classe
          var code = ''; 
          for (var i=0, max=this.colors.length, color; i<max; i++) { // on ajoute toutes les images des couleurs jouées par le joueur
            color = this.colors[i];
             code += "<img class='imagetag' alt='color' src='images/pion" + color + ".png' />"
          }
          colors.innerHTML = code;
          frame.appendChild(name); // on ajoute tout au document
          frame.appendChild(colors);
          document.getElementById('leftPanel').appendChild(frame);
          this.frame = frame; // on mémorise l'id du frame
        };
    }


function play(event) {  // fonction pour jouer un coup - se déclenche à chaque clic sur une case du plateau
    var row = parseInt(event.currentTarget.getAttribute('line'),10); // récupère le numéro de ligne
    var col = parseInt(event.currentTarget.getAttribute('column'),10); // récupère le numéro de colonne
    socket.emit('move request', { cell : [row,col] }); // envoie un message "move request" au serveur avec les coordonnées de la case
    }


  function updatePlayerFrames() { // fonction pour actualiser l'affichage des cadres joueurs
    var playerFrames = document.querySelectorAll('.playerInfo'); // récupÈre tous les cadres
    for (var i=0, max=playerFrames.length; i<max; i++) { // pour chaque cadre
      if (playerFrames[i].id === 'player' + (player+1)) { // si le joueur est le joueur dont c'est le tour
        playerFrames[i].firstChild.style.textDecoration = 'underline'; // on souligne son nom
      }
      else {
        playerFrames[i].firstChild.style.textDecoration = 'none'; // sinon on réinitialise l'affichage du nom sans soulignage
      }
    }
  }

  function sendMessage(message, sound) { // fonction pour afficher un message
    sound.play(); // on joue un son
    alert(message); // on affiche le message
  }

  function Sound(source) { // constructeur pour la classe "Sound"
    this.sound = document.createElement("audio"); // on crée un élément "audio"
    this.sound.src = source; // on attribue la source
    this.sound.setAttribute("preload", "auto"); // on charge les sons des le lancement de la page
    this.sound.setAttribute("controls", "none"); // on n'affiche pas les contrôles
    this.sound.style.display = "none"; // on masque l'élément
    document.body.appendChild(this.sound); // on ajoute au document
    this.play = function(){ // méthode pour jouer le son
      if (!Muted) this.sound.play(); // si le son n'est pas désactivé on joue le son
    }
  }

  function initArray(lines, columns, value) { // fonction qui initialise un array de taille lines * columns avec la valeur value - partager avec serveur ?
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

// on déclare tous les callbacks pour les messages serveur
    socket.on('connect', function() { // A ENLEVER
      console.log("socket id : ", this.id);
    })
    socket.on('select', function (data) { // si on recoit un message "select" 
      console.log("select : ", data); // permet de vérifier les données envoyées sur la console
      var row = data["cell"][0]; // on récupère le numéro de ligne
      var col = data["cell"][1]; // on récupère le numéro de colonne
      images[row][col].src = "images/pion" + gameBoard[row][col] + "vide.png"; // on change l'image du pion séléctionné
    });
    socket.on('deselect', function (data) { // si on recoit un message "deselect"
      console.log("deselect : ", data); // permet de vérifier les données envoyées sur la console
      var row = data["cell"][0]; // on récupère le numéro de ligne
      var col = data["cell"][1]; // on récupère le numéro de colonne
      images[row][col].src = "images/pion" + data["color"] + ".png"; // on change l'image du pion deséléctionné
    });
    socket.on('game error', function (data) { // si on recoit un message "game error"
      console.log("game error : ", data); // permet de vérifier les données envoyées sur la console
      sendMessage(data["message"], Sounds[data["sound"]]); // on affiche le message et on joue le son
    });
    socket.on('move', function (data) { // si on recoit un message "move"
      console.log("move : ", data); // permet de vérifier les données envoyées sur la console
      move(data["path"], data["playedColor"]); // on appelle la fonction move avec les arguments transmis par le serveur
    });
    socket.on('new turn', function (data) { // si on recoit un message "new turn"
      console.log("new turn : ", data); // permet de vérifier les données envoyées sur la console
      player = data["player"]; // on actualise le joueur dont c'est le tour
      updatePlayerFrames(); // on met à jour les cadres
    });
    socket.on('new game', function (data) { // si on recoit un message "new game"
      console.log("new game : ", data); // permet de vérifier les données envoyées sur la console
      numPlayers = data["numPlayers"]; // on met à jour le nombre de joueurs
      numColors = data["numColors"]; // on met à jour le nombre de couleurs
      COLORS = data["COLORS"]; // on met à jour la liste des couleurs pour chaque joueur
    });
    socket.on('end game', function (data) { // si on recoit un message "end game"
      console.log('end game :', data); // permet de vérifier les données envoyées sur la console
      endGame(data["winner"], data["score"]); // on appelle la fonction de fin de partie avec les arguments transmis par le serveur
    });
    socket.on('game joined', function (data) { // si on recoit un message "game joined"
      console.log("game joined : ", data); // permet de vérifier les données envoyées sur la console
      numPlayers = data["numPlayers"]; // on met à jour le nombre de joueurs 
      numColors = data["numColors"]; // on met à jour le nombre de couleurs
      COLORS = data["COLORS"]; // on met à jour la liste des couleurs pour chaque joueur
    });
    socket.on('name error', function (data) { // si on recoit un message "name error"
      document.getElementById("player1").value = prompt("Ce nom est déjà pris, veuillez en choisir un nouveau :", data['name']); // on affiche le message
      socket.emit('join game', { gameId: gameId, player: document.getElementById("player1").value }); // on envoie un message avec le nouveau nom
    });
    socket.on('game full', function (data) { // si on recoit un message "game full"
      console.log("game full : ", data); // permet de vérifier les données envoyées sur la console
      document.getElementById("joinGame").style.display = "none"; // on cache le message affichant le numéro de la salle de jeu
      isPlayedByIa = data["isPlayedByIa"]; // on récupère les variables du serveur
      numPlayers = data["numPlayers"]; 
      numColors = data["numColors"];
      COLORS = data["COLORS"];
      gameBoard = initGameBoard(); // on initialise le plateau de jeu
      images = createGameBoard(gameBoard); // on crée l'affichage du plateau de jeu
      PLAYERS = data["PLAYERS"]; // on récupère les données des joueurs
      for (var i=0, max=PLAYERS.length; i<max; i++) { // on crée les instances de la classe Player et les cadres des joueurs
        PLAYERS[i] = new Player(PLAYERS[i].name, PLAYERS[i].colors, PLAYERS[i].number);
        PLAYERS[i].createFrame();
      }
      player=0; // on inialise le tour au joueur 1
      restart(0); // on démarre la partie
    });
    socket.on('player disconnecting', function (data) { // si on recoit un message "player disconnecting"
      console.log('player disconnecting :', data); // permet de vérifier les données envoyées sur la console
      alert(data['name'] + '(Joueur ' + (data['number']+1) + ') a été déconnecté.'); // on affiche le message
    });
    socket.on('restart game', function () { // si on recoit un message "restart game"
      console.log('restart game'); // permet de vérifier les données envoyées sur la console
      gameBoard = initGameBoard(); // on reinitialise le plateau de jeu
      refreshBoard(gameBoard); // on réinitialise l'affichage
      player = 0; // on remet le tour au joueur 1
      updatePlayerFrames(); // on actualise les cadres des joueurs
    });
//})();
