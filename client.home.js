(function(exports){

  /**
   * @module Client
   */

  /**
   * @function seeMore
   * @description affiche / masque le div qui contient les infos sur les dames chinoises
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par : home.js
   *  <li> globales : -
   * @example
   * Client.seeMore() // si le texte supplémentaire est affiché, le masque
   * @return {undefined}
   */
  function seeMore() {
    var x = document.getElementById("seeMoreDiv"); // on récupère le div #seeMoreDiv
    var y = document.getElementById("seeMoreButton"); // on récupère le bouton #seeMoreButton
    if (x.style.display === "none") { // si le div est masqué, on affiche le div et on change le label du bouton
        x.style.display = "block";
        y.innerHTML = "Voir moins";
    }
    else { // sinon, on masque le div et on change le label du bouton
        x.style.display = "none";
        y.innerHTML = "Voir plus";
    }
  }

  /**
   * @function updateChoices
   * @description actualise les choix disponibles - déclenchée quand on change le nombre de joueurs
   * <ul>
   *  <li> appelle :
        <ul>
          <li> [Client.updateColors]{@link module:Client~updateColors}
          <li> [Client.deactivateTooltips]{@link module:Client~deactivateTooltips}
        </ul>
   *  <li> appelée par : home.js
   *  <li> globales : -
   * @return {undefined}
   * @example
   * Client.updateChoices() // -> si '2 joueurs' est sélectionné, affiche uniquement les champs des joueurs 1 et 2, ainsi que le choix du nombre de couleurs
   */
  function updateChoices() {
    var colorChoices = { // un dictionnaire qui indique pour chaque nombre de joueurs s'il faut afficher le choix du nombre de couleurs, et quelle valeur doit être cochée par défaut
      1: { display: 'inline', default: 1 },
      2: { display: 'inline', default: 1 },
      3: { display: 'none', default: 2 },
      4: { display: 'none', default: 1 },
      6: { display: 'none', default: 1 }
    };
    var checkbox;
    deactivateTooltips(); // masque tous les tooltips
    var list = document.getElementById("mode"); // on récupère le menu déroulant
    var mode = parseInt(list.options[list.selectedIndex].value); // on récupère la valeur sélectionnée
    document.getElementById("color_choice").style.display = colorChoices[mode]['display']; // on affiche ou on masque le choix du nombre de couleurs
    for (var i=1; i<=3; i++) { // on coche une case par défaut
      document.getElementById('colors'+i).checked = (i === colorChoices[mode].default) ? true : false
    }
    var iaLevel = document.getElementById('level_choice');
    var displayIaLevel = false;
    for (var i = 2; i <= mode; i++) { // pour chaque joueur
      document.getElementById("player"+i).style.display = 'inline-block'; // on affiche le champ du nom du joueur
      checkbox = document.getElementById("ordi"+i); // on récupère la case IA associée
      if (checkbox.checked) displayIaLevel = true; // si au moins une case est cochée, on change la valeur de displayIaLevel
      checkbox.style.display = 'inline'; // on affiche la case à cocher
      checkbox.nextSibling.style.display = 'inline'; // on affiche le label de la case à cocherr
    }
    for (var i = mode+1; i <= 6; i++) { // pour chaque joueur qui ne joue pas
      document.getElementById("player"+i).style.display = 'none'; // masque le champ
      checkbox = document.getElementById("ordi"+i); // récupère la case IA associée à ce joueur
      checkbox.style.display = 'none'; // masque la case à cocher
      checkbox.nextSibling.style.display = 'none'; // masque le label de la case à cocher
    }
    iaLevel.style.display = displayIaLevel ? 'block' : 'none';
    updateColors(); // on met à jour les couleurs pour chaque joueur
    for (var i in checkNewGameForm) { // pour chaque fonction de vérification sur le contenu du formulaire
      if (document.getElementById(i).value != '' && parseInt(i[6]) <= mode) { // on ne vérifie que si quelque chose a été saisi et si le joueur va jouer
        checkNewGameForm[i](i); // on vérifie le contenu du formulaire
      }
    }
  }

  /**
   * @function updateColors
   * @description actualise les pastilles de couleur pour chaque joueur - déclenchée quand on change le nombre de joueurs ou le nombre de couleurs
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par : [Client.updateChoices]{@link module:Client~updateChoices}
   *  <li> globales : -
   * @return {undefined}
   * @example
   * Client.updateColors() // -> si '2 joueurs' et '1 couleur' sont sélectionnés, affiche la couleur verte pour le joueur 1 et la couleur orange pour le joueur 2
   */
  function updateColors() {
    var list = document.getElementById("mode"); // on récupère le menu déroulant
    var mode = parseInt(list.options[list.selectedIndex].value); // on récupère la valeur sélectionnée
    for (var numColors = 1; numColors <= 3; numColors++) {   // on récupère le nombre de couleurs
      if (document.getElementById('colors'+numColors).checked) break;
    }
    var colors = { // attribution des couleurs à chaque joueur
      1: { // pour un joueur
        1: [[1],[2]], // une couleur
        2: [[1,3],[2,4]], // deux couleurs
        3: [[1,3,5],[2,4,6]] // trois couleurs
      },
      2: { // pour deux joueurs
        1: [[1],[2]], // une couleur
        2: [[1,3],[2,4]], // deux couleurs
        3: [[1,3,5],[2,4,6]] // trois couleurs
      },
      3: { 2: [[1,3],[4,5],[2,6]] }, // pour trois joueurs deux couleurs obligées
      4: { 1: [[1],[2],[3],[4]] }, // pour quatre joueurs une couleur obligée
      6: { 1: [[1],[3],[6],[2],[4],[5]] } // pour six joueurs une couleur obligée
    }[mode][numColors]; // on retourne pour chaque joueur la liste des couleurs
    for (var n=1; n<=mode; n++) { // pour chaque joueur qui joue
      var code = '';
      for (var i=0, max = colors[n-1].length; i < max; i++) { // pour chaque couleur on affiche les images correspondantes
        code += "<img class=\"imagetag\" src=\"images/pion" + colors[n-1][i] + ".png\">";
      }
      document.getElementById('player'+n+'colors').innerHTML = code;
    }
    for (var n=mode+1; n<=6; n++) { // on efface les couleurs des joueurs qui ne jouent pas
      document.getElementById('player'+n+'colors').innerHTML = '';
    }
  }

  /**
   * @function deactivateTooltips
   * @description masque les tooltips
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par : [Client.updateChoices]{@link module:Client~updateChoices}
   *  <li> globales : -
   * @return {undefined}
   * @example
   * Client.deactivateTooltips() -> masque tous les tooltips à l'écran
   */
  function deactivateTooltips() {
      var tooltips = document.querySelectorAll('.tooltip'), // on sélectionne tous les éléments de la classe tooltip
          tooltipsLength = tooltips.length;
      for (var i = 0; i < tooltipsLength; i++) {
          tooltips[i].style.display = 'none'; // on les masque tous
      }
  }

  /**
   * @function getTooltip
   * @description retourne le tooltip correspondant à un élément HTML, ou false si aucun tooltip n'a été trouvé
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par :
   *    <ul>
   *      <li> [Client.checkPlayer]{@link module:Client~checkPlayer}
   *      <li> [Client.checkRoomID]{@link module:Client.checkRoomID}
   *    </ul>
   *  <li> globales : -
   * @param {HTMLelement} element - l'élément HTML dont on veut le tooltip
   * @return {HTMLelement|Boolean}
   * @example
   * Client.getTooltip(document.getElementById('player1')) -> retourne le tooltip du joueur 1
   */
  function getTooltip(element) {
      while (element = element.nextSibling) {
          if (element.className === 'tooltip') {
              return element;
          }
      }
      return false;
  }

  /**
   * Fonctions de vérification du formulaire pour créer une partie, elles renvoient "true" si tout est ok
   * @member {Object} checkNewGameForm
   * @property {Function} player1 - vérifie le nom du joueur 1 (voir [Client.checkPlayer]{@link module:Client~checkPlayer})
   * @property {Function} player2 - vérifie le nom du joueur 2 (voir [Client.checkPlayer]{@link module:Client~checkPlayer})
   * @property {Function} player3 - vérifie le nom du joueur 3 (voir [Client.checkPlayer]{@link module:Client~checkPlayer})
   * @property {Function} player4 - vérifie le nom du joueur 4 (voir [Client.checkPlayer]{@link module:Client~checkPlayer})
   * @property {Function} player5 - vérifie le nom du joueur 5 (voir [Client.checkPlayer]{@link module:Client~checkPlayer})
   * @property {Function} player6 - vérifie le nom du joueur 6 (voir [Client.checkPlayer]{@link module:Client~checkPlayer})
   */
  var checkNewGameForm = {}; // On met toutes nos fonctions pour la création d'une nouvelle partie dans un objet littéral
  /**
   * Fonctions de vérification du formulaire pour rejoindre une partie, elles renvoient "true" si tout est ok
   * @member {Object} checkJoinGameForm
   * @property {Function} player - vérifie le nom du joueur (voir [Client.checkPlayer]{@link module:Client~checkPlayer})
   * @property {Function} roomID - vérifie le numéro de partie (voir [Client.checkRoomID]{@link module:Client.checkRoomID})
   */
  var checkJoinGameForm = {}; // On met toutes nos fonctions pour rejoindre une partie dans un objet littéral

  /**
   * @function checkPlayer
   * @description vérifie le nom d'un joueur
   * <ul>
   *  <li> appelle : [Client.getTooltip]{@link module:Client~getTooltip}
   *  <li> appelée par : home.js
   *  <li> globales : -
   * @param {String} id - l'id du joueur
   * @return {Boolean}
   * @example
   * document.getElementById('player1').value = 'John'
   * Client.checkPlayer('player1') // -> true
   * document.getElementById('player1').value = 'John-Jack-Joe'
   * Client.checkPlayer('player1') // -> false
   */
  function checkPlayer(id) {
      var player = document.getElementById(id),
          player1 = document.getElementById('player1'),
          player2 = document.getElementById('player2'),
          player3 = document.getElementById('player3'),
          player4 = document.getElementById('player4'),
          player5 = document.getElementById('player5'),
          player6 = document.getElementById('player6'),
          tooltip = getTooltip(player);
      var regex = new RegExp("^[a-zA-Z0-9_-]{2,10}$", "g"); // variable contenant la regex pour valider le nom
      if ((regex.test(player.value)) || player.value === '') { // si la regex est validée ou le champs est vide
        if (typeof(id[6]) === 'undefined') { // pour le champs "nom" du formulaire pour rejoindre une partie
          player.className = 'correct'; // on valide
          tooltip.style.display = 'none'; // on cache le tooltip
          return true;
        }
        else { // sinon pour le formulaire de création on vérifie si le champs et vide, que le nom n'est pas pris et que je joueur va jouer
          if (player.value === '' || (id[6] !== '1' && document.getElementById("ordi"+id[6]).checked) || (id[6] === '1' && typeof(document.getElementById("ordi"+id[6])) !== undefined) ||
             ((player === player1 || player.value != player1.value) &&
              (player === player2 || player.value != player2.value || player2.style.display == 'none') &&
              (player === player3 || player.value != player3.value || player3.style.display == 'none') &&
              (player === player4 || player.value != player4.value || player4.style.display == 'none') &&
              (player === player5 || player.value != player5.value || player5.style.display == 'none') &&
              (player === player6 || player.value != player6.value || player6.style.display == 'none')) ) {
            player.className = 'correct'; // on valide
            tooltip.style.display = 'none'; // on cache le tooltip
            return true;
          }
          else { // si le nom est déjà pris
            player.className = 'incorrect';
            tooltip.innerHTML = 'Ce nom est déjà pris'; // on change le texte du tooltip
            tooltip.style.display = 'inline-block'; // on affiche le tooltip
            return false;
          }
        }
      }
      else { // si la regex n'est pas validée
          player.className = 'incorrect';
          tooltip.innerHTML = 'Le nom doit comprendre :<br>- 2 à 10 caractères alphanumériques<br>ou des tirets'; // on change le texte du tooltip
          tooltip.style.display = 'inline-block'; // on affiche le tooltip
          return false;
      }
  }

  // pour tous les champs "nom" on appliquera la fonction checkPlayer
  checkNewGameForm['player1'] = checkPlayer;
  checkJoinGameForm['player'] = checkNewGameForm['player2'] = checkNewGameForm['player3'] = checkNewGameForm['player4'] = checkNewGameForm['player5'] = checkNewGameForm['player6'] = checkNewGameForm['player1'] ;

  checkJoinGameForm['roomID'] = function ()
  /**
   * @function checkRoomID
   * @memberof module:Client
   * @description vérifie le numéro de la salle de jeu saisi pour rejoindre une partie (fonction anonyme dans le code, propriété de [Client.checkJoinGameForm]{@link module:Client~checkJoinGameForm})
   * <ul>
   *  <li> appelle : [Client.getTooltip]{@link module:Client~getTooltip}
   *  <li> appelée par : home.js
   *  <li> globales : -
   * @return {Boolean}
   * @example
   * document.getElementById('roomID').value = '-1'
   * Client.checkJoinGameForm['roomID']() // -> false
   * document.getElementById('roomID').value = '74265'
   * Client.checkJoinGameForm['roomID']() // -> true
   */
   {
    var input = document.getElementById('roomID'); // on récupère le numéro saisi
    var tooltip = getTooltip(input); // on récupère le tooltip
    var regex = new RegExp("^[0-9]{1,6}$", "g"); // on définit la regex correspondante
    if (regex.test(input.value) && input.value <= 100000) { // si la regex est validée et que la valeur est inférieure à 100000
      input.className = 'correct'; // on valide
      tooltip.style.display = 'none'; // on cache le tooltip
      return true;
    }
    else { // si la regex n'est pas validée ou que la valeur est trop grande
        input.className = 'incorrect';
        tooltip.innerHTML = 'Le game ID doit être compris entre 0 et 100000'; // on change le texte du tooltip
        tooltip.style.display = 'inline-block'; // on affiche le tooltip
        return false;
    }
  };

  /**
   * @function disablePlayer
   * @description désactive / réactive le champ d'un joueur - déclenchée lors d'un clic sur la case 'IA' correspondante
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par : home.js
   *  <li> globales : -
   * @param {Int} n - le numéro du joueur (de 1 à 6)
   * @return {undefined}
   * @example
   * Client.disablePlayer(1) // -> désactive le champ du joueur 1
   * Client.disablePlayer(1) // -> réactive le champ du joueur 1
   */
  function disablePlayer(n) {
    var input = document.getElementById("player"+n); // on récupère le joueur n
    var checkbox = document.getElementById("ordi"+n); // on récupère la checkbox correspondante
    if (checkbox.checked) { // si la checkbox est cochée
      input.disabled = true; // on désactive le champs "nom"
      input.value = "Ordinateur"; // on attribue la valeur "ordinateur"
    }
    else { // si la checkbox n'est pas cochée
      input.disabled = false; // on active le champs texte
      input.value = ""; // on réinitialise le nom du joueur
    }
    var iaLevel = document.getElementById("level_choice");
    var displayIaLevel = false;
    var list = document.getElementById("mode"); // on récupère le menu déroulant
    var mode = parseInt(list.options[list.selectedIndex].value); // on récupère la valeur sélectionnée
    for (var i=2; i<=mode; i++) {
      checkbox = document.getElementById("ordi"+i);
      if (checkbox.checked) displayIaLevel = true;
    }
    iaLevel.style.display = (displayIaLevel) ? 'block' : 'none'; // on affiche ou pas le choix de difficulté
  }

  exports.seeMore = seeMore;
  exports.deactivateTooltips = deactivateTooltips;
  exports.getTooltip = getTooltip;
  exports.updateColors = updateColors;
  exports.updateChoices = updateChoices;
  exports.disablePlayer = disablePlayer;
  exports.checkPlayer = checkPlayer;
  exports.checkNewGameForm = checkNewGameForm;
  exports.checkJoinGameForm = checkJoinGameForm;

}(typeof exports === 'undefined' ? this.Client = {} : exports));
