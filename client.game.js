(function(exports){


  // crée le plateau de jeu basé sur la matrice
  function createGameBoard(matrice) {
    var board = Shared.initArray(17,25,false);
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

  function restart(option) { // fonction pour redémarrer une partie
    if (option) { // si une partie est déjà en cours
      document.getElementById('modal').style.display = "none"; // on cache le modal
      socket.emit('restart request'); // on envoie un message "restart request" au serveur
    }
    updatePlayerFrames(); // on reinitialise les frames de joueurs
  }

  function refreshBoard(gameBoard) { // actualise l'affichage du plateau de jeu
    for (var row=0; row<17; row++) { // pour chaque ligne
      for (var col=0; col<25; col++) { // pour chaque colonne
        if (images[row][col].src !== "images/pion" + gameBoard[row][col] + ".png") // si l'image ne correspond pas
          images[row][col].src = "images/pion" + gameBoard[row][col] + ".png"; // on change l'image
      }
    }
  }

  function move(path, playedColor) { // fonction pour déplacer un pion de couleur "playedColor" selon le chemin "path"
    var previous = path[0]; // case de départ
    var actual = path[1]; // case suivante
    gameBoard[previous[0]][previous[1]] = -1; // on marque la case de départ à -1 pour indiquer qu'elle n'est plus occupée
    gameBoard[actual[0]][actual[1]] = playedColor; // on marque la case suivante avec la couleur jouée
    images[previous[0]][previous[1]].src = "images/pion-1.png"; // on actualise les images des cases de départ et suivante
    images[actual[0]][actual[1]].src = "images/pion" + playedColor + ".png";
    SOUNDS.jump.play(); // on joue le son
    if (path.length > 2) { // si il y a d'autres sauts à effectuer
      (function(path) { // appel la fonction move avec le reste du chemin dans 500 ms
        setTimeout(function(){
          move(path, playedColor);
        }, 500); // temps d'exécution réduit pour les tests
      })(path.slice(1));
    }
  }

  function endGame(winner, score) { // fonction pour afficher la fin de la partie
    var modal = document.getElementById('modal'); // on sélectionne le modal
    var span = document.getElementsByClassName("close")[0];
    var content = document.getElementById("modalText");
    var restartButton = document.getElementById("restartButton");
    modal.style.display = "block";
    SOUNDS.win.play();
    span.onclick = function() { // devrait être dans game.js
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

  function play(event) { // fonction pour jouer un coup - se déclenche à chaque clic sur une case du plateau
    var row = parseInt(event.currentTarget.getAttribute('line'),10); // récupère le numéro de ligne
    var col = parseInt(event.currentTarget.getAttribute('column'),10); // récupère le numéro de colonne
    socket.emit('move request', { cell : [row,col] }); // envoie un message "move request" au serveur avec les coordonnées de la case
  }

  function updatePlayerFrames() { // fonction pour actualiser l'affichage des cadres joueurs
    var playerFrames = document.querySelectorAll('.playerInfo'); // récupère tous les cadres
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

  exports.createGameBoard = createGameBoard;
  exports.createCell = createCell;
  exports.restart = restart;
  exports.refreshBoard = refreshBoard;
  exports.endGame = endGame;
  exports.play = play;
  exports.move = move;
  exports.Player = Player;
  exports.updatePlayerFrames = updatePlayerFrames;
  exports.sendMessage = sendMessage;
  exports.Sound = Sound;

}(typeof exports === 'undefined' ? this.Client = {} : exports));
