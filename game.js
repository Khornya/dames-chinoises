// ***** infos des joueurs ***** (juste pour l'exemple, à récupérer via PHP)

var player1 = new Player('Joueur1',220,[1,2,3]);
var player2 = new Player('Joueur2',190,[4,5,6]);
var players = [player1, player2];

for (var i=0, max=players.length; i<max; i++) {
  createPlayerFrame(players[i]);
}



// ***** création du plateau de jeu *****

var X = 17, Y = 25; // lignes et colonnes
var Player = false;  // joueur symbolique
var IsOver = false; // partie terminée ?
var Start_Cell = (0,0) ; // case départ pour un mouvement
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

// // création de la matrice vide pour les canvas
// // est ce que necessaire dans notre code la metrice ID?
// var ID = [];
// for (var R=0; R<X; R++) {
//   ID[R] = [];
//   for (var C=0; C<Y; C++) {
//     ID[R][C] = false;
//   }
// }


/* var Row = 17, Col = 25;                                       // rows and columns
var Player = false, IsOver = false ;
var Start_Cell = (0,0) ;                                      // case départ pour un mouvement
var Tree = {}, list = [] ;
Fld = new Array(Row);                                         // fld matrice de 17*25 ele
for (i=0; i<Row; i++)
  Fld[i] = new Array(Col);
*/
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
  if (color !== false) { // si la case appartient à l'étoile
    // ajoute l'image de base pour la case
    cell.innerHTML = "<img alt='pion' src='images/pion" + color + ".png' />";
    // gère l'event 'click'
    cell.addEventListener('click', play);
  }
  // ID[R][C] = cell; // identité de chaque canvas dans la matrice ID
  return cell;
}

/* fonction pour ercommencer le jeu
function restart() {
  init_fld() ;
  init_board() ;
  Player=false  ;
}
 */

// syntaxe a revoir
function validate_movement(cell) {
  var R = cell.getAttribute('line');
  var C = cell.getAttribute('column');
  if (Start_Cell === (0,0)) { // premier click
    if (M[R][C] !== Player+1) return; // vérifie qu'on click sur le pion du joueur qui a la main // pourquoi Player+1 ?
    Start_Cell = (R,C);
    // RefreshScreen();
    cell.firstChild.src = "images/pion" + M[R][C] + "vide.png";
    get_traject(R,C);
    M[R][C] = -1; // marquer la case depart vide pour ne pas l'utiliser comme pivot dans get_hope()
  }
  else {
    if ((R,C) === Start_Cell) { // retour à la case départ annule le mouvement
      M[R][C] = Player+1;
      Start_Cell = (0,0);
      cell.firstChild.src = "images/pion" + M[R][C] + ".png";
      // RefreshScreen();
    }
    if (M[R][C] !== -1) return ; // cell not empty
        get_traject(Start_Cell[0], Start_Cell[1]);
        if (!Tree[(R, C)]) {
          alert("Invalid Move!");
          return ;
        }
        traject = Tree[(R,C)];
        make_move(traject);
     }
}

function get_traject(R, C) {
  // // ces boucles se comportent n'importe comment ! je ne comprends pas pourquoi
  // for (var i = R-1; i <= R+1; i++)  { // add mouvement adjacent
  //   for (var j = C-2; j <= C+2; j++) {
  //     if ((i !== R || j !== C) && in_board(i,j) && M[i][j] === -1) {
  //       Tree[(i,j)] =  [(R,C), (i,j)];
  //     }
  //   }
  // }
  get_hope(R,C); // check for hopes
  var newList;
  while (liste.length > 0) { // recursif
    newList = liste.shift() ;
    if (newList != Start_Cell)
      get_hope(newList[0], newList[1], Tree[newList]) ;
  }
}

function in_board(x,y) {
  return (-1<x<17 && -1<y<25);
}

function get_hope(R, C, parent) {

}

function make_move(mov_list) {

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
function play(event) {
  if (IsOver) return;
  validate_movement(event.currentTarget);
}
