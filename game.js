///(function() { // IIFE pour éviter les variables globales
var isInTestMode = false; // variable pour activer le mode test - true pour lancer un test
var testName = 'game'; // variable pour selectionner le nom du test à lancer

var socket = io(); // crée une instance de io à partir de socket.io

var numPlayers; // nombre de joueurs
var numColors; // nombre de couleurs
var level;     // level de l'IA
var COLORS; // liste des couleurs de chaque joueur
var gameId = parseInt(document.getElementById("gameId").value,10); // numéro de la partie généré par le serveur
var role = document.getElementById("role").value; // rôle du joueur - host ou guest

// ********************************** configuration nombre de joueurs nombre de couleurs ***************************

if (role === "host") { // si le joueur est host
  numPlayers = parseInt(document.getElementById("numPlayers").value,10); // on récupère le nombre de joueurs
  numColors = parseInt(document.getElementById("numColors").value,10);   // on récupère le nombre de couleurs
  level = parseInt(document.getElementById("level").value,10);           // on récupère le level de l'IA
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
  isPlayedByIa = Shared.initArray(numPlayers, 0, false); // on initialise l'array qui permet de savoir quel joueur est joué par l'IA
  if (level === 0) {
    isPlayedByIa = {
      2: { // deux joueurs
        1: [1,2], // une couleur
        2: [1,2], // deux couleurs
        3: [1,2] // trois couleurs
      },
      3: { 2: [2,2,2] }, // trois joueurs deux couleurs
      4: { 1: [1,2,1,2] }, // quatre joueurs une couleur
      6: { 1: [2,2,2,2,2,2] } // six joueurs une couleur
    }[numPlayers][numColors];
  }
  else {
    for (var i=1; i<=numPlayers; i++) { // pour chaque joueur
      if (document.getElementById("IA"+i).value!== ""){ // si il est joué par l'IA
        isPlayedByIa[i-1] = level;} // on attribue le joueur à l'IA avec le niveau choisi
    }
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

  var SOUNDS = { // sons qui seront liés aux events
    jump : new Client.Sound("sounds/click.mp3"),
    fail : new Client.Sound("sounds/fail.mp3"),
    win : new Client.Sound("sounds/win.mp3")
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
    span.onclick = function() { // si on clique sur le <span> on masque le modal
      modal.style.display = "none";
    }
    window.onclick = function(event) { // si on clique en dehors on masque le modal
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  });

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
      Client.sendMessage(data["message"], SOUNDS[data["sound"]]); // on affiche le message et on joue le son
    });
    socket.on('move', function (data) { // si on recoit un message "move"
      console.log("move : ", data); // permet de vérifier les données envoyées sur la console
      Client.move(data["path"], data["playedColor"]); // on appelle la fonction move avec les arguments transmis par le serveur
    });
    socket.on('new turn', function (data) { // si on recoit un message "new turn"
      console.log("new turn : ", data); // permet de vérifier les données envoyées sur la console
      player = data["player"]; // on actualise le joueur dont c'est le tour
      Client.updatePlayerFrames(); // on met à jour les cadres
    });
    socket.on('new game', function (data) { // si on recoit un message "new game"
      console.log("new game : ", data); // permet de vérifier les données envoyées sur la console
      numPlayers = data["numPlayers"]; // on met à jour le nombre de joueurs
      numColors = data["numColors"]; // on met à jour le nombre de couleurs
      COLORS = data["COLORS"]; // on met à jour la liste des couleurs pour chaque joueur
    });
    socket.on('end game', function (data) { // si on recoit un message "end game"
      console.log('end game :', data); // permet de vérifier les données envoyées sur la console
      Client.endGame(data["winner"], data["score"]); // on appelle la fonction de fin de partie avec les arguments transmis par le serveur
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
      gameBoard = Shared.initGameBoard(); // on initialise le plateau de jeu
      images = Client.createGameBoard(gameBoard); // on crée l'affichage du plateau de jeu
      PLAYERS = data["PLAYERS"]; // on récupère les données des joueurs
      for (var i=0, max=PLAYERS.length; i<max; i++) { // on crée les instances de la classe Player et les cadres des joueurs
        PLAYERS[i] = new Client.Player(PLAYERS[i].name, PLAYERS[i].colors, PLAYERS[i].number);
        PLAYERS[i].createFrame();
      }
      player=0; // on inialise le tour au joueur 1
      Client.restart(0); // on démarre la partie
    });
    socket.on('player disconnecting', function (data) { // si on recoit un message "player disconnecting"
      console.log('player disconnecting :', data); // permet de vérifier les données envoyées sur la console
      alert(data['name'] + '(Joueur ' + (data['number']+1) + ') a été déconnecté.'); // on affiche le message
    });
    socket.on('restart game', function () { // si on recoit un message "restart game"
      console.log('restart game'); // permet de vérifier les données envoyées sur la console
      gameBoard = Shared.initGameBoard(); // on reinitialise le plateau de jeu
      Client.refreshBoard(gameBoard); // on réinitialise l'affichage
      player = 0; // on remet le tour au joueur 1
      Client.updatePlayerFrames(); // on actualise les cadres des joueurs
    });
//})();
