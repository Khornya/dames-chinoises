(function () {
  for (var i=1;i<=6;i++) {
    disablePlayer(i);
  }
})();

updateChoices();

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
  for (var i = 1; i <= 6; i++) {
    document.getElementById("player"+i).style.display = 'none';
    checkbox = document.getElementById("IA"+i);
    checkbox.style.display = 'none';
    checkbox.nextSibling.style.display = 'none';
  }
  var e = document.getElementById("mode");
  var mode = e.options[e.selectedIndex].value;
  document.getElementById("color_choice").style.display = colorChoices[mode]['display'];
  for (var i=1; i<=3; i++) {
    document.getElementById(i).checked = (i === colorChoices[mode].default) ? true : false;
  }
  for (var i = 1; i <= mode; i++) {
    document.getElementById("player"+i).style.display = 'inline';
    checkbox = document.getElementById("IA"+i);
    checkbox.style.display = 'inline';
    checkbox.nextSibling.style.display = 'inline';
  }
  updateColors();
  for (var i in check) {
    if (document.getElementById(i).value != '' && parseInt(i[6]) <= mode) {
      check[i](i);
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

function disablePlayer(n) {
  var input = document.getElementById("player"+n);
  var checkbox = document.getElementById("IA"+n);
  if (checkbox.checked) {
    input.disabled = true;
    input.value = "Computer";
  }
  else {
    input.disabled = false;
    input.value = "";
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
var check = {}; // On met toutes nos fonctions dans un objet littéral

check['player1'] = function(id) {
    var player = document.getElementById(id),
        player1 = document.getElementById('player1'),
        player2 = document.getElementById('player2'),
        player3 = document.getElementById('player3'),
        player4 = document.getElementById('player4'),
        player5 = document.getElementById('player5'),
        player6 = document.getElementById('player6'),
        tooltip = getTooltip(player);
    var re = new RegExp("^[a-zA-Z0-9_-]{2,10}$", "g"); // variable contenant la regex pour valider le nom
    if ((re.test(player.value)) || player.value == '') {
        if (player.value === '' ||
            getElementById("IA"+id[6]).checked ||
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
          return false;
        }
    } 
    else {
        player.className = 'incorrect';
        tooltip.innerHTML = '[a-zA-Z0-9_-]{2,10}';
        tooltip.style.display = 'inline-block'; 
        var x = document.getElementById("PLAY");
        x.style.display = "none";
        return false;
    }

};

check['player2'] = check['player3'] = check['player4'] = check['player5'] = check['player6'] = check['player1'];

// Mise en place des événements

(function() { // Utilisation d'une IIFE pour éviter les variables globales.

    var form = document.getElementById('form'),
        inputs = document.querySelectorAll('input[type=text]'),
        inputsLength = inputs.length;
    for (var i = 0; i < inputsLength; i++) {
        inputs[i].addEventListener('keyup', function(e) {
            check[e.target.id](e.target.id); // "e.target" représente l'input actuellement modifié
        });
    }

    form.addEventListener('submit', function(e) {
        var result = true;
        var element = document.getElementById("mode");
        var mode = element.options[element.selectedIndex].value;
        for (var i in check) {
            result = (parseInt(i[6]) > mode || check[i](i)) && result;
        }
        if (result === true) {
          document.form.submit();
        }
        e.preventDefault();
    });

})();


// Maintenant que tout est initialisé, on peut désactiver les "tooltips"

deactivateTooltips();
