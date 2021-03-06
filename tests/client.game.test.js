import test from 'ava';
import sinon from 'sinon';

var pug = require('pug');
var rewire = require('rewire');

var Shared = rewire('../shared.js'); // fonctions utilitaires
var Client = rewire('../client.game.js'); // le fichier contenant les fonctions à tester

var SOUNDS = { // sons qui seront liés aux events
  jump : new Client.Sound("sounds/click.mp3"),
  fail : new Client.Sound("sounds/fail.mp3"),
  win : new Client.Sound("sounds/win.mp3")
}

var lastPlayedSound;
var lastAlert;
var emitData = [];

Client.__set__('Shared', Shared);
Client.__set__('SOUNDS', SOUNDS);
Client.__set__('Muted', false);
Client.__set__('SOUNDS.win.play', () => {lastPlayedSound='win'});
Client.__set__('SOUNDS.fail.play', () => {lastPlayedSound='fail'});
Client.__set__('SOUNDS.jump.play', () => {lastPlayedSound='jump'});
Client.__set__('alert', (message) => {lastAlert = message});
Client.__set__('socket', {
  emit : emit
});
Client.__set__('setTimeout', (f,t) => {f()});

// pour contourner les méthodes réseau

function emit(message,data) {
    emitData.push([message,data]);
}

test('Créer le plateau de jeu', t => {
  document.write(pug.renderFile('./views/game.pug', {})); // écrit la page de jeu dans la simulation du DOM
  t.is(document.getElementById('board').innerHTML, '');
  Client.createGameBoard(Shared.initGameBoard());
  t.is(document.getElementById('board').innerHTML, '<div id="line0" class="line"><div class="cell" line="0" column="12"><img alt="pion" src="images/pion1.png"></div></div><div id="line1" class="line"><div class="cell" line="1" column="11"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="1" column="13"><img alt="pion" src="images/pion1.png"></div></div><div id="line2" class="line"><div class="cell" line="2" column="10"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="2" column="12"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="2" column="14"><img alt="pion" src="images/pion1.png"></div></div><div id="line3" class="line"><div class="cell" line="3" column="9"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="3" column="11"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="3" column="13"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="3" column="15"><img alt="pion" src="images/pion1.png"></div></div><div id="line4" class="line"><div class="cell" line="4" column="0"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="4" column="2"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="4" column="4"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="4" column="6"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="4" column="8"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="4" column="10"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="4" column="12"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="4" column="14"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="4" column="16"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="4" column="18"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="4" column="20"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="4" column="22"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="4" column="24"><img alt="pion" src="images/pion5.png"></div></div><div id="line5" class="line"><div class="cell" line="5" column="1"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="5" column="3"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="5" column="5"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="5" column="7"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="9"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="11"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="13"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="15"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="17"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="19"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="5" column="21"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="5" column="23"><img alt="pion" src="images/pion5.png"></div></div><div id="line6" class="line"><div class="cell" line="6" column="2"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="6" column="4"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="6" column="6"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="8"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="10"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="12"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="14"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="16"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="18"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="20"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="6" column="22"><img alt="pion" src="images/pion5.png"></div></div><div id="line7" class="line"><div class="cell" line="7" column="3"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="7" column="5"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="7"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="9"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="11"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="13"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="15"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="17"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="19"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="21"><img alt="pion" src="images/pion5.png"></div></div><div id="line8" class="line"><div class="cell" line="8" column="4"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="6"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="8"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="10"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="12"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="14"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="16"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="18"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="20"><img alt="pion" src="images/pion-1.png"></div></div><div id="line9" class="line"><div class="cell" line="9" column="3"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="9" column="5"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="7"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="9"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="11"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="13"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="15"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="17"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="19"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="21"><img alt="pion" src="images/pion4.png"></div></div><div id="line10" class="line"><div class="cell" line="10" column="2"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="10" column="4"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="10" column="6"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="8"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="10"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="12"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="14"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="16"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="18"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="20"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="10" column="22"><img alt="pion" src="images/pion4.png"></div></div><div id="line11" class="line"><div class="cell" line="11" column="1"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="11" column="3"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="11" column="5"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="11" column="7"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="9"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="11"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="13"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="15"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="17"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="19"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="11" column="21"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="11" column="23"><img alt="pion" src="images/pion4.png"></div></div><div id="line12" class="line"><div class="cell" line="12" column="0"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="12" column="2"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="12" column="4"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="12" column="6"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="12" column="8"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="12" column="10"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="12" column="12"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="12" column="14"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="12" column="16"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="12" column="18"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="12" column="20"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="12" column="22"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="12" column="24"><img alt="pion" src="images/pion4.png"></div></div><div id="line13" class="line"><div class="cell" line="13" column="9"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="13" column="11"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="13" column="13"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="13" column="15"><img alt="pion" src="images/pion2.png"></div></div><div id="line14" class="line"><div class="cell" line="14" column="10"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="14" column="12"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="14" column="14"><img alt="pion" src="images/pion2.png"></div></div><div id="line15" class="line"><div class="cell" line="15" column="11"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="15" column="13"><img alt="pion" src="images/pion2.png"></div></div><div id="line16" class="line"><div class="cell" line="16" column="12"><img alt="pion" src="images/pion2.png"></div></div>');
});

test('Créer une case sur le plateau de jeu', t => {
t.is(Client.createCell([10,8],2).outerHTML, '<div class="cell" line="10" column="8"><img alt="pion" src="images/pion2.png"></div>');
t.is(Client.createCell([0,5],-1).outerHTML, '<div class="cell" line="0" column="5"><img alt="pion" src="images/pion-1.png"></div>');
});

test('Redémarrer une partie', t => {
  document.write(pug.renderFile('./views/game.pug', {})); // écrit la page de jeu dans la simulation du DOM
  document.getElementById('leftPanel').innerHTML = '<div class="playerInfo" id="player1"><p class="playerName" style="text-decoration: none;">Joueur 1</p><span class="playerColors"><img class="imagetag" alt="color" src="images/pion1.png"></span></div><div class="playerInfo" id="player2"><p class="playerName" style="text-decoration: underline;">Ordinateur</p><span class="playerColors"><img class="imagetag" alt="color" src="images/pion2.png"></span></div>'
  Client.__set__('player', 0);
  Client.restart(false);
  t.is(document.querySelectorAll('.playerInfo')[0].firstChild.style.textDecoration,'underline');
  t.is(document.querySelectorAll('.playerInfo')[1].firstChild.style.textDecoration,'none');
  document.getElementById('leftPanel').innerHTML = '<div class="playerInfo" id="player1"><p class="playerName" style="text-decoration: none;">Joueur 1</p><span class="playerColors"><img class="imagetag" alt="color" src="images/pion1.png"></span></div><div class="playerInfo" id="player2"><p class="playerName" style="text-decoration: underline;">Ordinateur</p><span class="playerColors"><img class="imagetag" alt="color" src="images/pion2.png"></span></div>';
  document.getElementById('modal').style.display = 'block';
  Client.restart(true);
  t.is(document.getElementById('modal').style.display, 'none');
  t.deepEqual(emitData, [['restart request', undefined]]);
});

test('Actualiser le plateau de jeu', t => {
  var gameBoard = Shared.initGameBoard();
  var images = Client.createGameBoard(gameBoard);
  Client.__set__('images',images);
  t.is(images[2][10].src, "images/pion1.png");
  t.is(images[4][8].src, "images/pion-1.png");
  t.is(images[0][12].src, "images/pion1.png");
  gameBoard[2][10] = 2;
  gameBoard[4][8] = 1;
  gameBoard[0][12] = 1;
  Client.refreshBoard(gameBoard);
  t.is(images[2][10].src, "images/pion2.png");
  t.is(images[4][8].src, "images/pion1.png");
  t.is(images[0][12].src, "images/pion1.png");
});

test('Afficher le message de fin de partie', t => {
  var modal = document.getElementById('modal');
  var span = document.getElementsByClassName("close")[0];
  var content = document.getElementById("modalText");
  var restartButton = document.getElementById("restartButton");
  Client.endGame();
  t.is(modal.style.display, 'block');
  t.is(content.innerHTML, "Vous avez gagné par forfait.");
  t.is(restartButton.style.display, "none");
  Client.__set__('PLAYERS', [{name:'Joe'},{name:'John'}]);
  Client.endGame(1,26);
  t.is(content.innerHTML, "John a gagné en 26 coups.");
  t.is(restartButton.style.display, "inline");
});

test('Jouer un coup', t => {
  emitData = [];
  var cell = Client.createCell([2,10],1);
  var event = {
    currentTarget : cell
  };
  Client.play(event);
  t.deepEqual(emitData, [['move request', {cell:[2,10]}]]);
});

test('Effectuer un déplacement', t => {
  var gameBoard = Shared.initGameBoard();
  var images = Client.createGameBoard(gameBoard);
  Client.__set__('gameBoard',gameBoard);
  Client.__set__('images',images);
  Client.move([[0,12],[4,8],[5,10]],1);
  t.is(Client.__get__('gameBoard')[0][12],-1);
  t.is(Client.__get__('gameBoard')[4][8],-1);
  t.is(Client.__get__('gameBoard')[5][10],1);
});

test('Créer un objet de la classe Player', t => {
  document.write(pug.renderFile('./views/game.pug', {})); // écrit la page de jeu dans la simulation du DOM
  var player = new Client.Player('John',[1,3],1,document.createElement('div'));
  t.is(player.name,'John');
  t.deepEqual(player.colors, [1,3]);
  t.is(player.number, 1);
  t.is(player.frame.outerHTML, '<div></div>');
  player.createFrame();
  t.is(document.querySelectorAll('#player1')[1].outerHTML, '<div class="playerInfo" id="player1"><p class="playerName">John</p><span class="playerColors"><img class="imagetag" alt="color" src="images/pion1.png"><img class="imagetag" alt="color" src="images/pion3.png"></span></div>');
  t.is(player.frame.outerHTML, '<div class="playerInfo" id="player1"><p class="playerName">John</p><span class="playerColors"><img class="imagetag" alt="color" src="images/pion1.png"><img class="imagetag" alt="color" src="images/pion3.png"></span></div>');
});

test('Créer un objet de la classe Sound', t => {
  var sound = new Client.Sound('./sounds/click.mp3');
  t.is(sound.sound.outerHTML, '<audio src="./sounds/click.mp3" preload="auto" controls="none" style="display: none;"></audio>');
  t.is(document.querySelector('audio').outerHTML, '<audio src="./sounds/click.mp3" preload="auto" controls="none" style="display: none;"></audio>');
});

test('Actualiser les cadres des joueurs', t => {
  document.getElementById('leftPanel').innerHTML = '<div class="playerInfo" id="player1"><p class="playerName" style="text-decoration: underline;">Joueur 1</p><span class="playerColors"><img class="imagetag" alt="color" src="images/pion1.png"></span></div><div class="playerInfo" id="player2"><p class="playerName" style="text-decoration: none;">Ordinateur</p><span class="playerColors"><img class="imagetag" alt="color" src="images/pion2.png"></span></div>'
  Client.__set__('player',1);
  Client.updatePlayerFrames();
  t.is(document.querySelectorAll('.playerInfo')[0].firstChild.style.textDecoration,'none');
  t.is(document.querySelectorAll('.playerInfo')[1].firstChild.style.textDecoration,'underline');
});

test('Afficher un message', t => {
  Client.sendMessage('Vous avez gagné !', SOUNDS.win);
  t.is(lastPlayedSound, 'win');
  t.is(lastAlert, 'Vous avez gagné !');
});
