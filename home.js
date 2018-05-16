utilities.someSharedMethod();

var socket = io();

function seemore() {
  var x = document.getElementById("seemore");
  var y = document.getElementById("voirPlus");
  if (x.style.display === "none") {
      x.style.display = "block";
      y.innerHTML = "Voir moins";
  }
  else {
      x.style.display = "none";
      y.innerHTML = "Voir plus";
  }
}

function updateChoices() {
  var colorChoices = {
    1: { display: '', default: 1 },
    2: { display: '', default: 1 },
    3: { display: 'none', default: 2 },
    4: { display: 'none', default: 1 },
    6: { display: 'none', default: 1 }
  };
  var checkbox;
  deactivateTooltips();
  for (var i = 2; i <= 6; i++) {
    document.getElementById("player"+i).style.display = 'none';
    checkbox = document.getElementById("ordi"+i);
    checkbox.style.display = 'none';
    checkbox.nextSibling.style.display = 'none';
  }
  var e = document.getElementById("mode");
  var mode = e.options[e.selectedIndex].value;
  document.getElementById("color_choice").style.display = colorChoices[mode]['display'];
  for (var i=1; i<=3; i++) {
    document.getElementById(i).checked = (i === colorChoices[mode].default) ? true : false;
  }
  for (var i = 2; i <= mode; i++) {
    document.getElementById("player"+i).style.display = 'inline';
    checkbox = document.getElementById("ordi"+i);
    checkbox.style.display = 'inline';
    checkbox.nextSibling.style.display = 'inline';
  }
  updateColors();
  for (var i in checkForm1) {
    if (document.getElementById(i).value != '' && parseInt(i[6]) <= mode) {
      checkForm1[i](i);
    }
  }
}

function updateColors() {
  var e = document.getElementById("mode");
  var mode = parseInt(e.options[e.selectedIndex].value);
  for (var n_color = 1; n_color <= 3; n_color++) {
    if (document.getElementById(n_color).checked) break;
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
  }[mode][n_color];
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
var checkForm1 = {}; // On met toutes nos fonctions dans un objet littéral
var checkForm2 = {};

function check_player(id) {
    var player = document.getElementById(id),
        player1 = document.getElementById('player1'),
        player2 = document.getElementById('player2'),
        player3 = document.getElementById('player3'),
        player4 = document.getElementById('player4'),
        player5 = document.getElementById('player5'),
        player6 = document.getElementById('player6'),
        tooltip = getTooltip(player);
    var re = new RegExp("^[a-zA-Z0-9_-]{2,10}$", "g"); // variable contenant la regex pour valider le nom
    if ((re.test(player.value)) || player.value === '') {
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

checkForm1['player1'] = check_player;

checkForm2['player'] = checkForm1['player2'] = checkForm1['player3'] = checkForm1['player4'] = checkForm1['player5'] = checkForm1['player6'] = checkForm1['player1'] ;

checkForm2['roomID'] = function () {
  var input = document.getElementById('roomID');
  var tooltip = getTooltip(input);
  var re = new RegExp("^[0-9]{1,6}$", "g");
  if (re.test(input.value) && input.value <= 100000) {
    input.className = 'correct';
    tooltip.style.display = 'none';
    return true;
  }
  else {
      input.className = 'incorrect';
      tooltip.innerHTML = 'Le game ID doit être comrpis netre 0 et 100000';
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

  var form1 = document.getElementById('form1'),
      inputs = document.querySelectorAll('input[type=text]');
  for (var i = 0; i <= 5; i++) {
      inputs[i].addEventListener('keyup', function(e) {
          checkForm1[e.target.id](e.target.id); // "e.target" représente l'input actuellement modifié
      });
  }

  form1.addEventListener('submit', function(e) {
      var result = true;
      var element = document.getElementById("mode");
      var mode = element.options[element.selectedIndex].value;
      for (var i in checkForm1) {
          result = (parseInt(i[6]) > mode || checkForm1[i](i)) && result;
      }
      if (result === true) {
        document.form1.submit();
      }
      e.preventDefault();
  });

  var form2 = document.getElementById('form2'),
      inputs = document.querySelectorAll('input[type=text]');
  for (var i = 6; i <= 7; i++) {
      inputs[i].addEventListener('keyup', function(e) {
          checkForm2[e.target.id](e.target.id); // "e.target" représente l'input actuellement modifié
      });
  }

  form2.addEventListener('submit', function(e) {
      var result = true;
      for (var i in checkForm2) {
          result = (checkForm2[i](i) && result);
      }
      if (result === true) {
        document.form2.submit();
      }
      e.preventDefault();
  });

  var boxes = document.querySelectorAll('input[type=checkbox]'),
      boxesLength = boxes.length;
  for (var i = 0; i < boxesLength; i++) {
      boxes[i].addEventListener('click', function(e) {
        checkForm1["player" + e.target.id[4]]("player" + e.target.id[4]);
      });
  }

deactivateTooltips();

for (var i=2;i<=6;i++) {
  disablePlayer(i);
}

updateChoices();

socket.on('connect', function () {
  // console.log("socket id : ", this.id);
});
