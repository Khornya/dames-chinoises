(function(exports){

  function seeMore() { // pour afficher le div qui contient les infos sur les dames chinoises
    var x = document.getElementById("seeMoreDiv"); // on récupère le div #seeMoreDiv
    var y = document.getElementById("seeMoreButton"); // on récupère le bouton #seeMoreButton
    if (x.style.display === "none") { // si le div est masqué, on affiche le div et on change le label du botuon
        x.style.display = "block";
        y.innerHTML = "Voir moins";
    }
    else { // sinon, on masque le div et on change le label du bouton
        x.style.display = "none";
        y.innerHTML = "Voir plus";
    }
  }

  function updateChoices() { // fonction déclenchée quand on change le nombre de joueurs
    var colorChoices = { // un dictionnaire qui indique pour chaque nombre de joueurs s'il faut afficher le choix du nombre de couleurs, et quelle valeur doit être cochée par défaut
      1: { display: '', default: 1 },
      2: { display: '', default: 1 },
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
      document.getElementById(i).checked = (i === colorChoices[mode].default) ? true : false
    }
    var iaLevel = document.getElementById('level_choice');
    var displayIaLevel = false;
    for (var i = 2; i <= mode; i++) { // pour chaque joueur
      document.getElementById("player"+i).style.display = 'inline'; // on affiche le champ du nom du joueur
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
    updateColors(); // on met à jour le socuelurs pour chauqe joueur
    for (var i in checkNewGameForm) { // pour chaque fonction de vérification sur le contenu du formulaire
      if (document.getElementById(i).value != '' && parseInt(i[6]) <= mode) { // on ne vérifie que si quelque chose a été saisi et si le joueur va jouer
        checkNewGameForm[i](i); // on vérifie le contenu du formulaire
      }
    }
  }

  function updateColors() { // met à jour l'affichage des couleurs à droite du nom des joueurs
    var list = document.getElementById("mode"); // on récupère le menu déroulant
    var mode = parseInt(list.options[list.selectedIndex].value); // on récupère la valeur sélectionnée
    for (var numColors = 1; numColors <= 3; numColors++) {   // on récupère le nombre de couleurs
      if (document.getElementById(numColors).checked) break;
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

  function deactivateTooltips() { // Fonction de désactivation de l'affichage des "tooltips"
      var tooltips = document.querySelectorAll('.tooltip'), // on sélectionne tous les éléments de la classe tooltip
          tooltipsLength = tooltips.length;
      for (var i = 0; i < tooltipsLength; i++) {
          tooltips[i].style.display = 'none'; // on les masque tous
      }
  }

  function getTooltip(elements) { // on récupére la "tooltip" qui correspond à l'input
      while (elements = elements.nextSibling) {
          if (elements.className === 'tooltip') {
              return elements;
          }
      }
      return false;
  }

  // Fonctions de vérification du formulaire, elles renvoient "true" si tout est ok
  var checkNewGameForm = {}; // On met toutes nos fonctions pour la création d'une nouvelle partie dans un objet littéral
  var checkJoinGameForm = {}; // On met toutes nos fonctions pour rejoindre une partie dans un objet littéral

  function checkPlayer(id) { // vérifie le nom d'un joueur
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
          if (player.value === '' || (id[6] !== '1' && document.getElementById("ordi"+id[6]).checked) || // A ENLEVER JOUEUR 1 PAS IA
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

  checkJoinGameForm['roomID'] = function () { // fonction pour vérifier le numéro de la salle de jeu saisi pour rejoindre une partie
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

  function disablePlayer(n) { // fonction pour masquer les champs d'un joueur inactif
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
