(function(exports){

  /**
   * @function createGameBoard
   * @memberof module:Client
   * @inner
   * @description crée un plateau de jeu à partir de l'Array <i>matrice</i>
   * <ul>
   *  <li> appelle :
   *    <ul>
   *      <li> [Shared.initArray]{@link module:Shared~initArray}
   *      <li> [Client.createCell]{@link module:Client~createCell}
   *    </ul>
   *  <li> appelée par : game.js
   *  <li> globales : -
   * @example
   * Client.createGameBoard() // -> code HTML produit :
   * // <div id="line0" class="line">
   * //    <div class="cell" line="0" column="12">
   * //      <img alt="pion" src="images/pion1.png">
   * //    </div>
   * // </div>
   * // <div id="line1" class="line">
   * //    <div class="cell" line="1" column="11">
   * //      <img alt="pion" src="images/pion1.png">
   * //    </div>
   * //    <div class="cell" line="1" column="13">
   * //      <img alt="pion" src="images/pion1.png">
   * //    </div>
   * // </div>
   * // etc.
   * @return {Array}
   * @param {Array} matrice - la matrice représentant le plateau de jeu
   */
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

 /**
  * @function createCell
  * @memberof module:Client
  * @inner
  * @description crée une case de coordonnées <i>cell</i> et de couleur <i>color</i>
  * <ul>
  *  <li> appelle : -
  *  <li> appelée par : [Client.createGameBoard]{@link module:Client~createGameBoard}
  *  <li> globales : -
  * @example
  * Client.createCell([2,10],1) // -> HTML <img> element
  * // code HTML produit :
  * // <div class="cell" line="2" column="10">
  * //    <img alt="pion" src="images/pion1.png">
  * // </div>
  * @return {HTMLelement} L'ID de l'élément <img> dans le DOM
  * @param {Array} cell - les coordonnées de la case
  * @param {int} color - la couleur du pion
  */
  function createCell(cell, color) {
    var div = document.createElement('div'); // on crée un div pour la cellule
    div.classList.add('cell'); // on lui attribue la classe "cell"
    div.setAttribute('line', cell[0]); // on met la valeur des attributs "line" et "column"
    div.setAttribute('column', cell[1]);
    div.innerHTML = "<img alt='pion' src='images/pion" + color + ".png' />";     // on ajoute l'image de base pour la case
    div.addEventListener('click', play);     // on ajoute un event "click" qui déclenchera la fonction "play"
    return div;
  }

  /**
   * @function restart
   * @memberof module:Client
   * @inner
   * @description redémarre la partie :
   * <ul><ul>
   *  <li> réinitialise les frames des joueurs
   *  <li> si besoin, masque le modal de fin de partie
   *  <li> si besoin, envoie un message 'restart request' au serveur
   * </ul></ul>
   * <ul>
   *  <li> appelle : [Client.updatePlayerFrames]{@link module:Client~updatePlayerFrames}
   *  <li> appelée par : game.js
   *  <li> globales : -
   * @example
   * Client.restart(true) // -> masque le modal, réinitialise les frames des joueurs et envoie la requête au serveur
   * @example
   * Client.restart(false) // -> réinitialise les frames des joueurs
   * @return {undefined}
   * @param {Boolean} isGameRunning - true si une partie est déjà en cours, false sinon
   * @emits restart request
   */
  function restart(isGameRunning) {
    if (isGameRunning) { // si une partie est déjà en cours
      document.getElementById('modal').style.display = "none"; // on cache le modal
      /**
       * demande au serveur à redémarrer la partie
       * @event restart request
       * @type {Object}
       */
      socket.emit('restart request'); // on envoie un message "restart request" au serveur
    }
    updatePlayerFrames(); // on réinitialise les frames de joueurs
  }

  /**
   * @function refreshBoard
   * @memberof module:Client
   * @inner
   * @description actualise l'affichage du plateau de jeu
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par : game.js
   *  <li> globales : images
   * @example
   * var gameBoard = Client.initGameBoard()
   * Client.refreshBoard(gameBoard) // -> réinitialise le plateau de jeu
   * @return {undefined}
   * @param {Array} gameBoard - la matrice représentant le plateau de jeu
   */
  function refreshBoard(gameBoard) {
    for (var row=0; row<17; row++) { // pour chaque ligne
      for (var col=0; col<25; col++) { // pour chaque colonne
        if (images[row][col].src !== "images/pion" + gameBoard[row][col] + ".png") // si l'image ne correspond pas
          images[row][col].src = "images/pion" + gameBoard[row][col] + ".png"; // on change l'image
      }
    }
  }

  /**
   * @function move
   * @memberof module:Client
   * @inner
   * @description déplace un pion de couleur <i>playedColor</i> selon le chemin <i>path</i>
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par : game.js
   *  <li> globales : gameBoard, images, SOUNDS
   * @example
   * Client.move([[2,10],[4,12],[4,14]],1) // -> déplace le pion vert de la case [2,10] à la case [4,14] en passant par la case [4,12]
   * @return {undefined}
   * @param {Int[][]} path - la liste des coordonnées des cases constituant le mouvement à effectuer
   * @param {Int} playedColor - le nombre correspondant à la couleur du pion à déplacer
   */
  function move(path, playedColor) {
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

  /**
   * @function endGame
   * @memberof module:Client
   * @inner
   * @description affiche la fin de la partie
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par : game.js
   *  <li> globales : SOUNDS, PLAYERS
   * @example
   * Client.endGame(1,22) // -> affiche dans le modal que le joueur 2 a gagné en 22 coups
   * @return {undefined}
   * @param {Int} winner - l'index du vainqueur dans PLAYERS
   * @param {Int} score - le score du vainqueur
   */
  function endGame(winner, score) {
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

  /**
   * @class Player
   * @description crée une instance de la classe Player, qui représente un joueur
   * @example
   * new Player('John',[1,3],1) // -> crée le joueur numéro 1 'John' qui joue les couleurs vert et bleu foncé
   * @return {Object}
   * @param {String} [name] - le nom du joueur
   * @param {Int[]} [colors] - la liste des couleurs jouées par le joueur
   * @param {Int} [number] - le numéro du joueur (de 1 à 6)
   * @param {HTMLelement} [frame] - la frame du joueur
   */
  function Player(name, colors, number, frame) {
    /**
     * @memberof Player
     * @description le nom du joueur
     * @type {String}
     */
    this.name = name;
    /**
     * @memberof Player
     * @description la liste des couleurs jouées par le joueur
     * @type {Int[]}
     */
    this.colors = colors;
    /**
     * @memberof Player
     * @description le numéro du joueur
     * @type {Int}
     */
    this.number = number;
    /**
     * @memberof Player
     * @description la frame du joueur
     * @type {HTMLelement}
     */
    this.frame = frame;
    /**
     * @method
     * @memberof Player
     * @description crée la frame du joueur
     * @return {undefined}
     */
    this.createFrame = function() {
      var frame = document.createElement('div'); // on crée un div
      frame.className = 'playerInfo'; // on attribue la classe
      frame.id = 'player' + this.number; // on attribue l'ID avec le numéro du joueur
      var name = document.createElement('p'); // on crée un paragraphe
      name.className = 'playerName'; // on attribue la classe playerName
      name.innerHTML = this.name; // on affiche le nom dans le paragraphe
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

  /**
   * @function play
   * @memberof module:Client
   * @inner
   * @description envoie un message pour jouer un coup au serveur - se déclenche à chaque clic sur une case du plateau
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par : game.js
   *  <li> globales : -
   * @emits move request
   * @example
   * Client.play(event) -> envoie un message 'move request' au serveur avec les coordonnées de la case sur laquelle on a cliqué
   * @param {Event} event - l'événement qui a déclenché la fonction
   * @return {undefined}
   */
  function play(event) {
    var row = parseInt(event.currentTarget.getAttribute('line'),10); // récupère le numéro de ligne
    var col = parseInt(event.currentTarget.getAttribute('column'),10); // récupère le numéro de colonne
    /**
     * demande au serveur d'effectuer un déplacement
     * @event move request
     * @type {Object}
     * @property {Array.Int} cell - les coordonnées de la case
     */
    socket.emit('move request', { cell : [row,col] }); // envoie un message "move request" au serveur avec les coordonnées de la case
  }

  /**
   * @function updatePlayerFrames
   * @memberof module:Client
   * @inner
   * @description actualise l'affichage des cadres joueurs
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par : game.js, [Client.restart]{@link module:Client~restart}
   *  <li> globales : -
   * @example
   * Client.updatePlayerFrames() -> souligne le nom du joueur dont c'est le tour
   * @return {undefined}
   */
  function updatePlayerFrames() {
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

  /**
   * @function sendMessage
   * @memberof module:Client
   * @inner
   * @description affiche un message et joue un son
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par : game.js
   *  <li> globales : -
   * @example
   * Client.sendMessage('Bravo', SOUNDS.win) -> affiche une alerte indiquant 'Bravo' et joue le son
   * @return {undefined}
   */
  function sendMessage(message, sound) {
    sound.play(); // on joue un son
    alert(message); // on affiche le message
  }

  /**
   * @class Sound
   * @description crée une instance de la classe Sound, qui représente un son
   * @example
   * new Sound("sounds/click.mp3") // -> crée une instance de la classe Sound avec pour source le fichier click.mp3
   * @return {Object}
   * @param {String} source - le chemin du fichier son à utiliser
   */
  function Sound(source) { // constructeur pour la classe "Sound"
    /**
     * @memberof Sound
     * @description l'élement &ltaudio&t correspondant au son
     * @type {HTMLelement}
     */
    this.sound = document.createElement("audio"); // on crée un élément "audio"
    this.sound.src = source; // on attribue la source
    this.sound.setAttribute("preload", "auto"); // on charge les sons des le lancement de la page
    this.sound.setAttribute("controls", "none"); // on n'affiche pas les contrôles
    this.sound.style.display = "none"; // on masque l'élément
    document.body.appendChild(this.sound); // on ajoute au document
    /**
     * @memberof Sound
     * @description joue le son
     * @return {undefined}
     */
    this.play = function(){
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
