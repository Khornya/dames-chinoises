// ***** infos des joueurs ***** (juste pour l'exemple, à récupérer via PHP)
n_color = sessionStorage.color_number; 
ordi_player = sessionStorage.ordi_player;

var player1 = new Player('Joueur1',220,n_color, 1);
var player2 = new Player('Joueur2',190,n_color, 2);
var players = [player1, player2];


// ***** création du plateau de jeu *****

var X = 17, Y = 25; // lignes et colonnes
var Player = false;  // joueur symbolique
var IsOver = false; // partie terminée ?
var Start_Cell =  (0,0) ; // case départ pour un mouvement // pas de couples en JS
var Color;
var isOver = [];
for (var i=0; i<2; i++)  // 2 nombre de joueur
  isOver[i]=[]
  for(j=0; j<n_color;j++)
  isOver[i][j]=false; 

// création de la matrice vide pour le plateau de jeu
var M = [];
for (var R=0; R<X; R++) {
  M[R] = [];
  for (var C=0; C<Y; C++) {
    M[R][C] = false;
  }
}

// création de la matrice vide pour les canvas
// est ce que necessaire dans notre code la metrice ID?
var ID = [];
for (var R=0; R<X; R++) {
  ID[R] = [];
  for (var C=0; C<Y; C++) {
    ID[R][C] = false;
  }
}

restart();



// ***** fonctions *****

// initialise la matrice pour le plateau de jeu
function init_matrice() {
  for (var R=0; R<4; R++) { // R pour row, C pour column
    for (var C=12-R; C<=12+R; C+=2) {
      M[R][C] = 1;
      M[16-R][C] = 2;
    }
  }
  for (var R=4; R<8; R++) {
    for (var C=12-R; C<=12+R; C+=2) {
      M[R][C] = -1;
      M[16-R][C] = -1;
    }
    for (var C=R-4; C<=10-R; C+=2) {
      M[R][C] = 3;
      M[16-R][24-C] = 4;
      M[R][24-C] = 5;
      M[16-R][C] = 6;
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
        cell = create_cell(R, C, M[R][C]);
        line.appendChild(cell);
      }
    }
  }
  jump = new sound("Sounds/click.mp3");
  fail = new sound("Sounds/fail.mp3");
  win = new sound("Sound/win.mp3");
}

// crée une case
function create_cell(R, C, option) {
  var cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('line', R);
  cell.setAttribute('column', C);
  // if (color !== false) { // si la case appartient à l'étoile // test redondant deja testé dans create_board()
    // ajoute l'image de base pour la case
  cell.innerHTML = "<img alt='pion' src='images/pion" + M[R][C] + ".png' />";
    // gère l'event 'click'
  cell.addEventListener('click', play);
  ID[R][C] = cell.firstChild; // identité de chaque image dans la matrice ID
  return cell;
}

// fonction pour recommencer le jeu
function restart() {
  init_matrice() ;
  create_board() ;
  Player=false  ;
  IsOver = false;
  Start_Cell =  (0,0) ;
  for (var i=0, max=players.length; i<max; i++) {
    createPlayerFrame(players[i]);
  }
  update_player_frames();
}

function validate_movement(cell) {
  var R = parseInt(cell.getAttribute('line'),10);
  var C = parseInt(cell.getAttribute('column'),10);
  if (Start_Cell === (0,0)) {                                    // premier click
    if (!((Player+M[R][C])%2) || M[R][C]> 2*n_color) {           // vérifie qu'on click sur le pion du joueur qui a la main
      send_msg("please click on your own pieces", fail); 
      return;
    }
    Start_Cell = [R,C];
    ID[R][C].src = "images/pion" + M[R][C] + "vide.png";
    Color = M[R][C]
    M[R][C] = -1;                                                // marquer la case depart vide pour ne pas l'utiliser comme pivot dans get_jump()
  }
  else {
    if (Start_Cell[0] === R && Start_Cell[1] === C) {            // retour à la case départ annule le mouvement
      M[R][C] = Color;
      Start_Cell = (0,0);
      ID[R][C].src = "images/pion" + Color + ".png";
      return;
    }
    if (M[R][C] !== -1)                                          // cell not empty
      {send_msg("Cell not empty!", fail); return;} 
    if (!(traject = get_traject(Start_Cell, R, C))) {// mouvement invalide     
      send_msg("Invalide Move!", fail);
      return ;
    }
    make_move(traject);
  }
}

function get_traject(start, R1, C1) {
  var R = start[0]; var C = start[1]; 
  var i, j;
  for (i =R-1; i <= R+1; i++)  {               // add mouvement adjaçant
    for (j=C-2; j<= C+2; j++) {
       if ((i!=R || j!=C) && in_board(i,j) && M[i][j]== -1)
         if (i==R1 && j==C1) return [start,[i,j]];
    }
  }
  return get_jump([start], R1,C1) ;
}



function get_jump(liste , R1, C1, traject=[]) {
  if (liste.length<1) return;
  var i, j, k;
  var pivot_r , pivot_c;
  var n, index;
  var access_cell = []
  var R = liste[0][0]; var C = liste[0][1];
  // chercher saut sur ligne dans 2 directions:
  for (j of [-2, 2]) { // avancer de deux pas sur la ligne
    pivot_c = C+j;
    while (in_board(R, pivot_c) && M[R][pivot_c] === -1) {  //avancer jusqu'a case occupée
        pivot_c += j;
    }
    n=0;
    for (k=2; k< (j/2)*(pivot_c-C); k+=2) {
      if (!in_board(R, pivot_c+j*k)) break ;
      if (M[R][pivot_c+j*k] != -1) n+=1 ; //si un autre pion sur le chemin
    }
    if (n==0) { // seulement s'il ya un seul pion sur le chemin servant de pivot
      index = 2*pivot_c-C;
      if (contains(traject, [R, index])) continue ; // éviter de tourner rond
      if (in_board(R, index) && M[R][index]=== -1) { // si la case en symétrie est vide valide:
       if (R==R1 && index==C1) return traject.concat([[R, C], [R, index]]) ;
       else access_cell.push([R, index]);
      }
    }
  }

  // chercher saut sur diagonal 4 directions :
  for (i of [-1, 1]) { // avancer d'un seul pas sur le diagonal
    for (j of [-1, 1]) {
      pivot_r = R+i;
      pivot_c = C+j;
      while (in_board(pivot_r, pivot_c) && M[pivot_r][pivot_c] === -1) { // avancer jusqu'a case occupée
        pivot_r += i;
        pivot_c += j;
      }
      n=0;
      for (k=1; k< j*(pivot_c-C); k+=1) {
        if (!in_board(pivot_r+i*k, pivot_c+j*k)) break;
        if (M[pivot_r+i*k][pivot_c+j*k] !== -1) n+=1; // si un autre pion sur le chemin break
      }
      if (n===0) {
        index_r = 2*pivot_r-R;
        index_c = 2*pivot_c-C;
        if (contains(traject,[index_r, index_c])) continue ; // éviter de tourner rond
        if (in_board(index_r, index_c) && M[index_r][index_c] === -1) { // si la case en asymétrie est vide valide:
          if (index_r==R1 && index_c==C1) return traject.concat([[R,C], [index_r, index_c]]);
          else access_cell.push([index_r, index_c]);
        }
      }
    }
  }
  return (get_jump(liste.slice(1), R1, C1, traject) || 
          get_jump(access_cell, R1, C1, traject.concat([liste[0]])));
}



function make_move(mov_list) {
  var previous = mov_list[0];
  // try {
    var actuel = mov_list[1];
    M[previous[0]][previous[1]] = -1;
    M[actuel[0]][actuel[1]] = Color;
    ID[previous[0]][previous[1]].src = "images/pion-1.png";
    ID[actuel[0]][actuel[1]].src = "images/pion" + Color + ".png";
    jump.play();
    if (mov_list.length > 2) {
      (function(mov_list) {
        setTimeout(function(){
          make_move(mov_list);
        }, 500);
      })(mov_list.slice(1));
    }
    else {
      Start_Cell = (0,0);
      Tree = {};
      Player = !Player;
      update_player_frames();
      check_winner(Player, Color);

    }
}



// crée un cadre pour les infos d'un joueur
function createPlayerFrame(player) {
  var frame = document.createElement('div');
  frame.className = 'player_info';
  frame.id = 'player' + player['number'];
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
function Player(name, score, n_color, number) {
  this.name = name;
  this.score = score;
  colors = [];
  for (var i=number; i<= 2*n_color; i+=2) {
    colors.push(i);
  }  
  this.colors = colors;
  this.number = number;
}


// se déclenche à chaque clic sur une case du plateau
function play(event) {
  if (IsOver) return;
  validate_movement(event.currentTarget);
}

function in_board(x,y) {
  return (x > -1 && x < 17 && y > -1 && y<25);
}

function update_player_frames() {
  var player_frames = document.querySelectorAll('.player_info');
  for (var i=0, max=player_frames.length; i<max; i++) {
    if (player_frames[i].id === 'player' + (Player+1)) {
      player_frames[i].style.border = '2px solid black';
    }
    else {
      player_frames[i].style.border = '2px dotted grey';
    }
  }
}

function send_msg(msg, sound) {
  sound.play();
  alert(msg);
}

function contains(liste, obj) {
  var i = liste.length;
  while (i--) {
    if (liste[i] == obj.join()) {
      return true;
    }
  }
  return false;
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
    }
    this.stop = function(){
        this.sound.pause();
    }
}
