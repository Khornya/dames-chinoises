// ***** infos des joueurs ***** (juste pour l'exemple, à récupérer via PHP)

var player1 = new Player('Joueur1',220,[1,2,3]);
var player2 = new Player('Joueur2',190,[4,5,6]);
var players = [player1, player2];

for (var i=0, max=players.length; i<max; i++) {
  createPlayerFrame(players[i]);
}



// ***** création du plateau de jeu *****

var X = 17, Y = 25; // lignes et colonnes
var J = false;  // joueur symbolique
var isOver = false; // partie terminée ?
var Start = (0,0); // case départ pour un mouvement
var Tree = {};
var liste = [];
var score_liste = [0, 0]; // score initial égal à zéro

// création de la matrice vide pour le plateau de jeu
var M = [];
for (var R=0; R<X; R++) {
  M[R] = [];
  for (var C=0; C<Y; C++) {
    M[R][C] = false;
  }
}

// création de la matrice vide pour les canvas
var ID = [];
for (var R=0; R<X; R++) {
  ID[R] = [];
  for (var C=0; C<Y; C++) {
    ID[R][C] = false;
  }
}

init_matrice();
create_board();

// ***** fonctions *****

// initialise la matrice pour le plateau de jeu
function init_matrice() {
  for (var R=0; R<4; R++) { // R pour row, C pour column
    for (var C=12-R; C<12+R+1; C+=2) {
      M[R][C] = 1;
      M[16-R][C] = 2;
    }
  }
  for (var R=4; R<8; R++) {
    for (var C=12-R; C<12+R+1; C+=2) {
      M[R][C] = -1;
      M[16-R][C] = -1;
    }
    for (var C=R-4; C<10-R+1; C+=2) {
      M[R][C] = 3;
      M[16-R][C] = 4;
      M[R][24-C] = 5;
      M[16-R][24-C] = 6;
    }
  }
  for (var C=4; C<21; C+=2) { M[8][C] = -1 }
}

// crée le plateau de jeu
function create_board() {
  var line, cell;
  for (var R=0; R<X; R++) { // crée un div pour chaque ligne
    line = document.createElement('div');
    line.id = 'line'+R;
    line.className = 'line';
    document.getElementById('board').appendChild(line);
    for (var C=0; C<Y; C++) { // crée un div pour chaque cellule
      if (M[R][C] !== false) {
        cell = create_canevas(R, C, M[R][C]);
        line.appendChild(cell);
      }
    }
  }
}

// crée une case
function create_canevas(R, C, option) {
  var cell = document.createElement('div');
  var color = M[R][C];
  cell.classList.add('cell');
  cell.setAttribute('line', R);
  cell.setAttribute('column', C);
  // ajoute l'image de base pour la case
  cell.innerHTML = "<img alt='pion' src='images/pion" + color + ".png' />";
  if (color !== false) { // si la case appartient à l'étoile, gère l'event 'clic'
    cell.addEventListener('click', joue);
  }
  ID[R][C] = cell; // identité de chaque canvas dans la matrice ID
  return cell;
}

// crée un cadre pour les infos d'un joueur
function createPlayerFrame(player) {
  var frame = document.createElement('div');
  frame.className = 'player_info';
  var name = document.createElement('p');
  name.className = 'player_name';
  name.innerHTML = player['name'];
  var score = document.createElement('p');
  score.className = 'player_score';
  score.innerHTML = ('score : ' + player['score']);
  var colors = document.createElement('span');
  colors.className = 'player_colors';
  var code = '';
  for (var i=0, max=player['colors'].length, color; i<max; i++) {
    color = player['colors'][i];
     code += "<img alt='color' src='images/pion" + color + ".png' />"
  }
  colors.innerHTML = code;
  frame.appendChild(name);
  frame.appendChild(colors);
  frame.appendChild(score);
  document.getElementById('left_panel').appendChild(frame);
}

// constructeur pour la classe Player
function Player(name, score, colors) {
  this.name = name;
  this.score = score;
  this.colors = colors;
}

// se déclenche à chaque clic sur une case du plateau
function joue() {
  console.log('Vous avez cliqué !');
}
