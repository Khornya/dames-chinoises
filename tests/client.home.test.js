import test from 'ava';
var pug = require('pug');

var Client = require('../client.home.js'); // le fichier contenant les fonctions à tester

document.write(pug.renderFile('./views/home.pug', {})); // écrit la page d'accueil dans la simulation du DOM

test('Afficher / masquer le texte', t => {
  t.is(document.getElementById('seeMoreDiv').style.display, 'none');
  Client.seeMore();
  t.is(document.getElementById('seeMoreDiv').style.display, 'block');
  Client.seeMore();
  t.is(document.getElementById('seeMoreDiv').style.display, 'none');
});

test('Désactiver les tooltips', t => {
  var tooltips = document.querySelectorAll('.tooltip');
  for (var i=0; i<=7; i++) {
    t.is(tooltips[i].style.display,'');
  }
  Client.deactivateTooltips();
  for (var i=0; i<=7; i++) {
    t.is(tooltips[i].style.display,'none');
  }
});

test('Récupérer un tooltip', t => {
  document.querySelector('#player1').parentNode.innerHTML = '<input id="player1" type="text" name="player1" placeholder="Joueur 1"><span id="player1colors"></span><span class="tooltip" >Je suis le tooltip du joueur 1</span>';
  document.querySelector('#player5').parentNode.innerHTML = '<input id="player5" type="text" name="player5" placeholder="Joueur 5"><span id="player5colors"></span><span class="tooltip" >Je suis le tooltip du joueur 5</span>';
  t.is(Client.getTooltip(document.querySelector('#player1')).innerHTML, 'Je suis le tooltip du joueur 1');
  t.is(Client.getTooltip(document.querySelector('#player2')).innerHTML, '');
  t.is(Client.getTooltip(document.querySelector('#player3')).innerHTML, '');
  t.is(Client.getTooltip(document.querySelector('#player4')).innerHTML, '');
  t.is(Client.getTooltip(document.querySelector('#player5')).innerHTML, 'Je suis le tooltip du joueur 5');
  t.is(Client.getTooltip(document.querySelector('#player6')).innerHTML, '');
});

test('Désactiver / réactiver un joueur joué par l\'IA',t => {
  document.getElementById("mode").options[document.getElementById("mode").selectedIndex].value = "2"; // on sélectionne le mode 2 joueurs
  t.false(document.querySelector('#player2').disabled);
  t.is(document.querySelector('#player2').value, '');
  t.is(document.querySelector('#level_choice').style.display, 'none');
  document.querySelector('#ordi2').checked = true; // on coche la case IA du joueur 2
  Client.disablePlayer(2);
  t.true(document.querySelector('#player2').disabled);
  t.is(document.querySelector('#player2').value, 'Ordinateur');
  t.is(document.querySelector('#level_choice').style.display, 'block');
  document.querySelector('#ordi2').checked = false; // on décoche la case IA du joueur 2
  Client.disablePlayer(2);
  t.false(document.querySelector('#player2').disabled);
  t.is(document.querySelector('#player2').value, '');
  t.is(document.querySelector('#level_choice').style.display, 'none');
  document.getElementById("mode").options[document.getElementById("mode").selectedIndex].value = "3"; // on sélectionne le mode 3 joueurs
  document.querySelector('#ordi2').checked = true; // on coche la case IA du joueur 2
  Client.disablePlayer(2);
  document.querySelector('#ordi3').checked = true; // on coche la case IA du joueur 3
  Client.disablePlayer(3);
  t.true(document.querySelector('#player3').disabled);
  t.is(document.querySelector('#player3').value, 'Ordinateur');
  t.is(document.querySelector('#level_choice').style.display, 'block');
  document.querySelector('#ordi2').checked = false; // on décoche la case IA du joueur 2
  Client.disablePlayer(2);
  t.is(document.querySelector('#level_choice').style.display, 'block');
  document.querySelector('#ordi3').checked = false; // on décoche la case IA du joueur 3
  Client.disablePlayer(3);
  t.is(document.querySelector('#level_choice').style.display, 'none');
});

test('Afficher les couleurs pour chaque joueur', t => {
  document.getElementById("mode").options[document.getElementById("mode").selectedIndex].value = "2"; // on sélectionne le mode 2 joueurs
  document.getElementById('colors1').checked = true; // on sélectionne le mode 1 couleur
  Client.updateColors();
  t.is(document.getElementById('player1colors').innerHTML,"<img class=\"imagetag\" src=\"images/pion1.png\">");
  t.is(document.getElementById('player2colors').innerHTML,"<img class=\"imagetag\" src=\"images/pion2.png\">");
  t.is(document.getElementById('player3colors').innerHTML,'');
  t.is(document.getElementById('player4colors').innerHTML,'');
  t.is(document.getElementById('player5colors').innerHTML,'');
  t.is(document.getElementById('player6colors').innerHTML,'');
  document.getElementById('colors2').checked = true; // on sélectionne le mode 2 couleurs
  Client.updateColors();
  t.is(document.getElementById('player1colors').innerHTML,"<img class=\"imagetag\" src=\"images/pion1.png\"><img class=\"imagetag\" src=\"images/pion3.png\">");
  t.is(document.getElementById('player2colors').innerHTML,"<img class=\"imagetag\" src=\"images/pion2.png\"><img class=\"imagetag\" src=\"images/pion4.png\">");
  t.is(document.getElementById('player3colors').innerHTML,'');
  t.is(document.getElementById('player4colors').innerHTML,'');
  t.is(document.getElementById('player5colors').innerHTML,'');
  t.is(document.getElementById('player6colors').innerHTML,'');
  document.getElementById('colors3').checked = true; // on sélectionne le mode 3 couleurs
  Client.updateColors();
  t.is(document.getElementById('player1colors').innerHTML,"<img class=\"imagetag\" src=\"images/pion1.png\"><img class=\"imagetag\" src=\"images/pion3.png\"><img class=\"imagetag\" src=\"images/pion5.png\">");
  t.is(document.getElementById('player2colors').innerHTML,"<img class=\"imagetag\" src=\"images/pion2.png\"><img class=\"imagetag\" src=\"images/pion4.png\"><img class=\"imagetag\" src=\"images/pion6.png\">");
  t.is(document.getElementById('player3colors').innerHTML,'');
  t.is(document.getElementById('player4colors').innerHTML,'');
  t.is(document.getElementById('player5colors').innerHTML,'');
  t.is(document.getElementById('player6colors').innerHTML,'');
  document.getElementById("mode").options[document.getElementById("mode").selectedIndex].value = "3"; // on sélectionne le mode 3 joueurs
  document.getElementById('colors2').checked = true; // on sélectionne le mode 2 couleurs
  Client.updateColors();
  t.is(document.getElementById('player1colors').innerHTML,"<img class=\"imagetag\" src=\"images/pion1.png\"><img class=\"imagetag\" src=\"images/pion3.png\">");
  t.is(document.getElementById('player2colors').innerHTML,"<img class=\"imagetag\" src=\"images/pion4.png\"><img class=\"imagetag\" src=\"images/pion5.png\">");
  t.is(document.getElementById('player3colors').innerHTML,"<img class=\"imagetag\" src=\"images/pion2.png\"><img class=\"imagetag\" src=\"images/pion6.png\">");
  t.is(document.getElementById('player4colors').innerHTML,'');
  t.is(document.getElementById('player5colors').innerHTML,'');
  t.is(document.getElementById('player6colors').innerHTML,'');
  document.getElementById("mode").options[document.getElementById("mode").selectedIndex].value = "4"; // on sélectionne le mode 4 joueurs
  document.getElementById('colors1').checked = true; // on sélectionne le mode 1 couleur
  Client.updateColors();
  t.is(document.getElementById('player1colors').innerHTML, "<img class=\"imagetag\" src=\"images/pion1.png\">");
  t.is(document.getElementById('player2colors').innerHTML, "<img class=\"imagetag\" src=\"images/pion2.png\">");
  t.is(document.getElementById('player3colors').innerHTML, "<img class=\"imagetag\" src=\"images/pion3.png\">");
  t.is(document.getElementById('player4colors').innerHTML, "<img class=\"imagetag\" src=\"images/pion4.png\">");
  t.is(document.getElementById('player5colors').innerHTML,'');
  t.is(document.getElementById('player6colors').innerHTML,'');
});

test('Afficher les options en fonctions du nombre de joueurs', t => {
  document.write(pug.renderFile('./views/home.pug', {})); // écrit la page d'accueil dans la simulation du DOM
  document.getElementById("mode").options[document.getElementById("mode").selectedIndex].value = "2"; // on sélectionne le mode 2 joueurs
  Client.updateChoices();
  t.is(document.getElementById("color_choice").style.display, '');
  t.true(document.getElementById('colors1').checked);
  t.false(document.getElementById('colors2').checked);
  t.false(document.getElementById('colors3').checked);
  t.is(document.getElementById('player1').style.display, '');
  t.is(document.getElementById('player2').style.display, 'inline');
  t.is(document.getElementById("ordi2").style.display, 'inline');
  t.is(document.getElementById("ordi2").nextSibling.style.display, 'inline');
  t.is(document.getElementById('player3').style.display, 'none');
  t.is(document.getElementById("ordi3").style.display, 'none');
  t.is(document.getElementById("ordi3").nextSibling.style.display, 'none');
  t.is(document.getElementById('player4').style.display, 'none');
  t.is(document.getElementById("ordi4").style.display, 'none');
  t.is(document.getElementById("ordi4").nextSibling.style.display, 'none');
  t.is(document.getElementById('player5').style.display, 'none');
  t.is(document.getElementById("ordi5").style.display, 'none');
  t.is(document.getElementById("ordi5").nextSibling.style.display, 'none');
  t.is(document.getElementById('player6').style.display, 'none');
  t.is(document.getElementById("ordi6").style.display, 'none');
  t.is(document.getElementById("ordi6").nextSibling.style.display, 'none');
  document.getElementById("mode").options[document.getElementById("mode").selectedIndex].value = "3"; // on sélectionne le mode 3 joueurs
  Client.updateChoices();
  t.is(document.getElementById("color_choice").style.display, 'none');
  t.false(document.getElementById('colors1').checked);
  t.true(document.getElementById('colors2').checked);
  t.false(document.getElementById('colors3').checked);
  t.is(document.getElementById('player1').style.display, '');
  t.is(document.getElementById('player2').style.display, 'inline');
  t.is(document.getElementById("ordi2").style.display, 'inline');
  t.is(document.getElementById("ordi2").nextSibling.style.display, 'inline');
  t.is(document.getElementById('player3').style.display, 'inline');
  t.is(document.getElementById("ordi3").style.display, 'inline');
  t.is(document.getElementById("ordi3").nextSibling.style.display, 'inline');
  t.is(document.getElementById('player4').style.display, 'none');
  t.is(document.getElementById("ordi4").style.display, 'none');
  t.is(document.getElementById("ordi4").nextSibling.style.display, 'none');
  t.is(document.getElementById('player5').style.display, 'none');
  t.is(document.getElementById("ordi5").style.display, 'none');
  t.is(document.getElementById("ordi5").nextSibling.style.display, 'none');
  t.is(document.getElementById('player6').style.display, 'none');
  t.is(document.getElementById("ordi6").style.display, 'none');
  t.is(document.getElementById("ordi6").nextSibling.style.display, 'none');
  document.getElementById('ordi3').checked = true; // on coche la case IA du joueur 3
  Client.disablePlayer(3); // on affiche le choix de difficulté
  t.is(document.getElementById('level_choice').style.display, 'block');
  document.getElementById('player2').value = 'Joe';
  document.getElementById('player3').value = 'Joe';
  Client.checkPlayer('player2');
  t.is(document.getElementById('player2').className, 'incorrect');
  document.getElementById("mode").options[document.getElementById("mode").selectedIndex].value = "2"; // on sélectionne le mode 2 joueurs
  Client.updateChoices();
  t.is(document.getElementById('level_choice').style.display, 'none');
  t.is(document.getElementById('player2').className, 'correct');
});

test('Vérifier le nom d\'un joueur', t => {
  var tooltip;
  document.write(pug.renderFile('./views/home.pug', {})); // écrit la page d'accueil dans la simulation du DOM
  document.getElementById("mode").options[document.getElementById("mode").selectedIndex].value = "3"; // on sélectionne le mode 3 joueurs
  tooltip = Client.getTooltip(document.getElementById('player3'));
  t.true(Client.checkPlayer('player3'));
  t.is(document.getElementById('player3').className, 'correct');
  t.is(tooltip.style.display, 'none');
  document.getElementById('player3').value = 'J';
  t.false(Client.checkPlayer('player3'));
  t.is(document.getElementById('player3').className, 'incorrect');
  t.is(tooltip.innerHTML, 'Le nom doit comprendre :<br>- 2 à 10 caractères alphanumériques<br>ou des tirets');
  t.is(tooltip.style.display, 'inline-block');
  document.getElementById('player3').value = 'JoeJackJohn';
  t.false(Client.checkPlayer('player3'));
  t.is(document.getElementById('player3').className, 'incorrect');
  t.is(tooltip.innerHTML, 'Le nom doit comprendre :<br>- 2 à 10 caractères alphanumériques<br>ou des tirets');
  t.is(tooltip.style.display, 'inline-block');
  document.getElementById('player3').value = 'John-Kevin';
  t.true(Client.checkPlayer('player3'));
  t.is(document.getElementById('player3').className, 'correct');
  t.is(tooltip.style.display, 'none');
  document.getElementById('player3').value = 'Joe$';
  t.false(Client.checkPlayer('player3'));
  t.is(document.getElementById('player3').className, 'incorrect');
  t.is(tooltip.innerHTML, 'Le nom doit comprendre :<br>- 2 à 10 caractères alphanumériques<br>ou des tirets');
  t.is(tooltip.style.display, 'inline-block');
  document.getElementById('player3').value = 'Joe';
  document.getElementById('player4').value = 'Joe';
  t.false(Client.checkPlayer('player3'));
  t.is(document.getElementById('player3').className, 'incorrect');
  t.is(tooltip.innerHTML, 'Ce nom est déjà pris');
  t.is(tooltip.style.display, 'inline-block');
  document.getElementById('player3').value = 'Ordinateur';
  document.getElementById('ordi3').checked = true;
  document.getElementById('player4').value = 'Ordinateur';
  t.true(Client.checkPlayer('player3'));
  t.is(document.getElementById('player3').className, 'correct');
  t.is(tooltip.style.display, 'none');
  tooltip = Client.getTooltip(document.getElementById('player'));
  t.true(Client.checkPlayer('player'));
  t.is(document.getElementById('player').className, 'correct');
  t.is(tooltip.style.display, 'none');
  document.getElementById('player').value = 'JoeJackJohn';
  t.false(Client.checkPlayer('player'));
  t.is(document.getElementById('player').className, 'incorrect');
  t.is(tooltip.innerHTML, 'Le nom doit comprendre :<br>- 2 à 10 caractères alphanumériques<br>ou des tirets');
  document.getElementById('player').value = 'Joe';
  t.is(tooltip.style.display, 'inline-block');
  t.true(Client.checkPlayer('player'));
  t.is(document.getElementById('player').className, 'correct');
  t.is(tooltip.style.display, 'none');
});

test('Vérifier un numéro de partie', t => {
  document.write(pug.renderFile('./views/home.pug', {})); // écrit la page d'accueil dans la simulation du DOM
  var tooltip = Client.getTooltip(document.getElementById('roomID'));
  document.getElementById('roomID').value = 100000;
  t.true(Client.checkJoinGameForm['roomID']('roomID'));
  t.is(document.getElementById('roomID').className, 'correct');
  t.is(tooltip.style.display, 'none');
  document.getElementById('roomID').value = -1;
  t.false(Client.checkJoinGameForm['roomID']('roomID'));
  t.is(document.getElementById('roomID').className, 'incorrect');
  t.is(tooltip.innerHTML, 'Le game ID doit être compris entre 0 et 100000');
  t.is(tooltip.style.display, 'inline-block');
  document.getElementById('roomID').value = 0;
  t.true(Client.checkJoinGameForm['roomID']('roomID'));
  t.is(document.getElementById('roomID').className, 'correct');
  t.is(tooltip.style.display, 'none');
});
