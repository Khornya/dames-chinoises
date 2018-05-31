utilities.someSharedMethod(); // méthode partagé entre client en serveur

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
  for (var i = 2; i <= 6; i++) { // pour tous les champs de nom de joueur à partir du 2e
    document.getElementById("player"+i).style.display = 'none'; // masque le champ
    checkbox = document.getElementById("ordi"+i); // récupère la case IA associée à ce joeuur
    checkbox.style.display = 'none'; // masque la case à cocher
    checkbox.nextSibling.style.display = 'none'; // masque le label de la case à cocher
  }
  var list = document.getElementById("mode"); // on récupèr ele menu déroulant
  var mode = list.options[list.selectedIndex].value; // on récupère la valeur sélectionnée
  document.getElementById("color_choice").style.display = colorChoices[mode]['display']; // on affiche ou on masque le choix du nombre de couleurs
  for (var i=1; i<=3; i++) { // on coche une case par défaut
    document.getElementById(i).checked = (i === colorChoices[mode].default) ? true : false
  }
  for (var i = 2; i <= mode; i++) { // pou rhcaque joueur
    document.getElementById("player"+i).style.display = 'inline'; // on affiche le champ du nom du joueur
    checkbox = document.getElementById("ordi"+i); // on récupère la case IA associée
    checkbox.style.display = 'inline'; // on affiche la case à cocher
    checkbox.nextSibling.style.display = 'inline'; // on affiche le label de l acase à cocherr
  }
  updateColors(); // on met à jour le socuelurs pour chauqe joueur
  for (var i in checkNewGameForm) { // pour chaque fonction de vérification su rl eocntenu du formulaire
    if (document.getElementById(i).value != '' && parseInt(i[6]) <= mode) { // on ne vérifie que si quelque chose a été saisi et si le joueur va jouer
      checkNewGameForm[i](i); // on vérfie le ocntenu du formulaire
    }
  }
}

function updateColors() {
  var list = document.getElementById("mode");
  var mode = parseInt(list.options[list.selectedIndex].value);
  for (var numColors = 1; numColors <= 3; numColors++) {
    if (document.getElementById(numColors).checked) break;
  }
  var colors = { // attribution des couleurs à chaque joueur
    1: {
      1: [[1],[2]],
      2: [[1,3],[2,4]],
      3: [[1,3,5],[2,4,6]]
    },
    2: {
      1: [[1],[2]],
      2: [[1,3],[2,4]],
      3: [[1,3,5],[2,4,6]]
    },
    3: { 2: [[1,3],[4,5],[2,6]] },
    4: { 1: [[1],[2],[3],[4]] },
    6: { 1: [[1],[3],[6],[2],[4],[5]] }
  }[mode][numColors];
  for (var n=1; n<=mode; n++) {
    var code = '';
    for (var i=0, max = colors[n-1].length; i < max; i++) {
      code += "<img class='imagetag' src='images/pion" + colors[n-1][i] + ".png'/>";
    }
    document.getElementById('player'+n+'colors').innerHTML = code;
  }
  for (var n=mode+1; n<=6; n++) {
    document.getElementById('player'+n+'colors').innerHTML = '';
  }
}

// Fonction de désactivation de l'affichage des "tooltips"
function deactivateTooltips() {
    var tooltips = document.querySelectorAll('.tooltip'),
        tooltipsLength = tooltips.length;
    for (var i = 0; i < tooltipsLength; i++) {
        tooltips[i].style.display = 'none';
    }
}


// La fonction ci-dessous permet de récupérer la "tooltip" qui correspond à notre input
function getTooltip(elements) {
    while (elements = elements.nextSibling) {
        if (elements.className === 'tooltip') {
            return elements;
        }
    }
    return false;
}

// Fonctions de vérification du formulaire, elles renvoient "true" si tout est ok
var checkNewGameForm = {}; // On met toutes nos fonctions dans un objet littéral
var checkJoinGameForm = {};

function check_player(id) {
    var player = document.getElementById(id),
        player1 = document.getElementById('player1'),
        player2 = document.getElementById('player2'),
        player3 = document.getElementById('player3'),
        player4 = document.getElementById('player4'),
        player5 = document.getElementById('player5'),
        player6 = document.getElementById('player6'),
        tooltip = getTooltip(player);
    var regex = new RegExp("^[a-zA-Z0-9_-]{2,10}$", "g"); // variable contenant la regex pour valider le nom
    if ((regex.test(player.value)) || player.value === '') {
      if (typeof(id[6]) === 'undefined') {
        player.className = 'correct';
        tooltip.style.display = 'none';
        return true;
      }
      else {
        if (player.value === '' || (id[6] !== '1' && document.getElementById("ordi"+id[6]).checked) ||
           ((player === player1 || player.value != player1.value) &&
            (player === player2 || player.value != player2.value || player2.style.display == 'none') &&
            (player === player3 || player.value != player3.value || player3.style.display == 'none') &&
            (player === player4 || player.value != player4.value || player4.style.display == 'none') &&
            (player === player5 || player.value != player5.value || player5.style.display == 'none') &&
            (player === player6 || player.value != player6.value || player6.style.display == 'none')) ) {
          player.className = 'correct';
          tooltip.style.display = 'none';
          return true;
        }
        else {
          player.className = 'incorrect';
          tooltip.innerHTML = 'Ce nom est déjà pris';
          tooltip.style.display = 'inline-block';
        }
      }
    }
    else {
        player.className = 'incorrect';
        tooltip.innerHTML = 'Le nom doit comprendre :<br>- 2 à 10 caractères alphanumériques<br>ou des tirets';
        tooltip.style.display = 'inline-block';
        return false;
    }
}

checkNewGameForm['player1'] = check_player;

checkJoinGameForm['player'] = checkNewGameForm['player2'] = checkNewGameForm['player3'] = checkNewGameForm['player4'] = checkNewGameForm['player5'] = checkNewGameForm['player6'] = checkNewGameForm['player1'] ;

checkJoinGameForm['roomID'] = function () {
  var input = document.getElementById('roomID');
  var tooltip = getTooltip(input);
  var regex = new RegExp("^[0-9]{1,6}$", "g");
  if (regex.test(input.value) && input.value <= 100000) {
    input.className = 'correct';
    tooltip.style.display = 'none';
    return true;
  }
  else {
      input.className = 'incorrect';
      tooltip.innerHTML = 'Le game ID doit être compris entre 0 et 100000';
      tooltip.style.display = 'inline-block';
      return false;
  }
};

function disablePlayer(n) {
  var input = document.getElementById("player"+n);
  var checkbox = document.getElementById("ordi"+n);
  if (checkbox.checked) {
    input.disabled = true;
    input.value = "Ordinateur";
  }
  else {
    input.disabled = false;
    input.value = "";
  }
}

// Mise en place des événements

  var newGameForm = document.getElementById('newGameForm'),
      inputs = document.querySelectorAll('input[type=text]');
  for (var i = 0; i <= 5; i++) {
      inputs[i].addEventListener('keyup', function(event) {
          checkNewGameForm[event.target.id](event.target.id); // "event.target" représente l'input actuellement modifié
      });
  }

  newGameForm.addEventListener('submit', function(event) {
      var result = true;
      var element = document.getElementById("mode");
      var mode = element.options[element.selectedIndex].value;
      for (var i in checkNewGameForm) {
          result = (parseInt(i[6]) > mode || checkNewGameForm[i](i)) && result;
      }
      if (result === true) {
        document.newGameForm.submit();
      }
      event.preventDefault();
  });

  var joinGameForm = document.getElementById('joinGameForm'),
      inputs = document.querySelectorAll('input[type=text]');
  for (var i = 6; i <= 7; i++) {
      inputs[i].addEventListener('keyup', function(event) {
          checkJoinGameForm[event.target.id](event.target.id); // "event.target" représente l'input actuellement modifié
      });
  }

  joinGameForm.addEventListener('submit', function(event) {
      var result = true;
      for (var i in checkJoinGameForm) {
          result = (checkJoinGameForm[i](i) && result);
      }
      if (result === true) {
        document.joinGameForm.submit();
      }
      event.preventDefault();
  });

  var boxes = document.querySelectorAll('input[type=checkbox]'),
      boxesLength = boxes.length;
  for (var i = 0; i < boxesLength; i++) {
      boxes[i].addEventListener('click', function(event) {
        checkNewGameForm["player" + event.target.id[4]]("player" + event.target.id[4]);
      });
  }

deactivateTooltips();

for (var i=2;i<=6;i++) {
  disablePlayer(i);
}

updateChoices();
