import test from 'ava';
var pug = require('pug');

var Client = require('./client.js'); // le fichier contenant les fonctions à tester

document.write(pug.renderFile('./views/index.pug', {})); // écrit la page d'accueil dans la simulation du DOM

test('Afficher / masquer le texte', t => {
  // document.body.innerHTML = document.getElementById('seeMoreDiv').outerHTML + document.getElementById('seeMoreButton').outerHTML;
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
