// POUR LES TESTS : ajoute un script supplémentaire
var test = false; // true pour lancer les tests
if (test) {
  var test_script = document.createElement('script');
  test_script.src = 'tests/test-game.js'; // le script de test à exécuter
  document.getElementById('main_wrapper').insertBefore(test_script, document.getElementsByTagName('footer')[0]);
}
// FIN TESTS


// ***** création du plateau de jeu *****

var X = 17, Y = 25; // lignes et colonnes
var Player = false;  // joueur symbolique
var IsOver = false; // partie terminée ?
var Start_Cell =  [0,0] ; // case départ pour un mouvement // pas de couples en JS
var Tree = {};
var Liste = [];
var Color;

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

// ***** fonctions *****

var methods = { // je mets les fonctions dans un objet pour pouvoir les importer facilement pour les tests (et aussi ça évite de polluer l'espace global, il vaudrait faire pareil avec les variables)

  // initialise la matrice pour le plateau de jeu
  init_matrice: function() {
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
  },

  // crée le plateau de jeu
  create_board: function() {
    var line, cell;
    for (var R=0; R<X; R++) { // crée un div pour chaque ligne
      line = document.createElement('div');
      line.id = 'line'+R;
      line.className = 'line';
      document.getElementById('board').appendChild(line);
      for (var C=0; C<Y; C++) { // crée un div pour chaque cellule
        if (M[R][C] !== false) {
          cell = methods.create_canevas(R, C, M[R][C]);
          line.appendChild(cell);
        }
      }
    }
    hope = new methods.sound("Sounds/click.mp3");
    fail = new methods.sound("Sounds/fail.mp3");
  },

  // crée une case
  create_canevas: function(R, C, option) {
    var cell = document.createElement('div');
    var color = M[R][C];
    cell.classList.add('cell');
    cell.setAttribute('line', R);
    cell.setAttribute('column', C);
    if (color !== false) { // si la case appartient à l'étoile
      // ajoute l'image de base pour la case
      cell.innerHTML = "<img alt='pion' src='images/pion" + color + ".png' />";
      // gère l'event 'click'
      cell.addEventListener('click', methods.play);
    }
    ID[R][C] = cell.firstChild; // identité de chaque image dans la matrice ID
    return cell;
  },

  /* fonction pour ercommencer le jeu
  function restart() {
    init_fld() ;
    init_board() ;
    Player=false  ;
  }
   */
  validate_movement: function(cell) {
    var R = parseInt(cell.getAttribute('line'),10);
    var C = parseInt(cell.getAttribute('column'),10);
    if (Start_Cell[0] === 0 && Start_Cell[1] === 0) { // premier click
      if (!((Player+M[R][C])%2) || M[R][C]> 2*n_color) return; // vérifie qu'on click sur le pion du joueur qui a la main
      Start_Cell = [R,C];
      // RefreshScreen();
      cell.firstChild.src = "images/pion" + M[R][C] + "vide.png";
      Color = M[R][C]
      M[R][C] = -1; // marquer la case depart vide pour ne pas l'utiliser comme pivot dans get_hope()
    }
    else {
      if (Start_Cell[0] === R && Start_Cell[1] === C) { // retour à la case départ annule le mouvement
        M[R][C] = Color;
        Start_Cell = [0,0];
        cell.firstChild.src = "images/pion" + Color + ".png"; //ok je vois l'intéret c'est mieux que d'utilser refershscreen
        // RefreshScreen();
      }
      if (M[R][C] !== -1) return ; // cell not empty
      methods.get_traject(Start_Cell[0], Start_Cell[1]);
      if (! ([R, C] in Tree)) { // certains mouvements sont détectés invalides à tort
        fail.play();
        alert("Invalid Move!");
        return ;
      }
      traject = Tree[[R,C]];
      methods.make_move(traject);
    }
  },

  get_traject: function(R, C) {
    var i, j;
    for (i =R-1; i <= R+1; i++)  {               // add mouvement adjaçant
      for (j=C-2; j<= C+2; j++) {
         if ((i!=R || j!=C) && methods.in_board(i,j) && M[i][j]== -1)
           Tree[[i,j]] = [[R,C],[i,j]];
      }
    }
    methods.get_hope(R,C) ;
    while (Liste.length>0) {
    cell = Liste.shift() ;
      if (cell !== Start_Cell) {
        methods.get_hope(cell[0], cell[1], Tree[cell]) ;
      }
    }
  },

  get_hope: function(R, C, parent=0) {
    var i, j, k;
    var pivot_r , pivot_c;
    var n, index;
    if (!parent) parent = [[R,C]];
    // chercher saut sur ligne dans 2 directions:
    for (j=-2; j<3; j+=4) { // avancer de deux pas sur la ligne
      pivot_c = C+j;
      while (methods.in_board(R, pivot_c) && M[R][pivot_c] === -1) { //avancer jusqu'a case occupée
        pivot_c += j;
      }
      n=0;
      for (k=pivot_c+j; k<2*pivot_c-C; k+=j) {
        if (!methods.in_board(R, k)) break ;
        if (M[R][k] != -1) n+=1 ; //si un autre pion sur le chemin
      }
      if (n==0) { // seulement s'il ya un seul pion sur le chemin servant de pivot
         index = 2*pivot_c-C;
         if ([R, index] in Tree) continue ; // éviter de tourner rond
         if (methods.in_board(R, index) && M[R][index]=== -1) { // si la case en symétrie est vide valide:
           Tree[[R,index]] = parent.concat([[R, index]]);
           Liste.push([R, index])
         }
      }
    }
    // chercher saut sur diagonal 4 directions :
    for (i=-1; i<2; i+=2) { // avancer d'un seul pas sur le diagonal
      for (j=-1; j<2; j+=2) {
        pivot_r = R+i;
        pivot_c = C+j;
        while (methods.in_board(pivot_r, pivot_c) && M[pivot_r][pivot_c] === -1) { // avancer jusqu'a case occupée
          pivot_r += i;
          pivot_c += j;
        }
        n=0;
        for (k=1; k< (pivot_c-C); k+=1) {
          if (!methods.in_board(pivot_r+i*k, pivot_c+j*k)) break;
          if (M[pivot_r+i*k][pivot_c+j*k] !== -1) n+=1; // si un autre pion sur le chemin break
        }
        if (n===0) {
          index_r = 2*pivot_r-R;
          index_c = 2*pivot_c-C;
          if ([index_r, index_c] in Tree) continue ; // éviter de tourner rond
          if (methods.in_board(index_r, index_c) && M[index_r][index_c] === -1) { // si la case en asymétrie est vide valide:
            Tree[[index_r,index_c]] = parent.concat([[index_r, index_c]]);
            Liste.push([index_r, index_c]);
          }
        }
      }
    }
  },

  make_move: function(mov_list) {
    var previous = mov_list[0];
    // try {
      var actuel = mov_list[1];
      M[previous[0]][previous[1]] = -1;
      M[actuel[0]][actuel[1]] = Color;
      ID[previous[0]][previous[1]].src = "images/pion-1.png";
      ID[actuel[0]][actuel[1]].src = "images/pion" + Color + ".png";
      hope.play();
      if (mov_list.length > 2) {
        (function(mov_list) {
          setTimeout(function(){
            methods.make_move(mov_list);
          }, 500*(!test)); // modifie le temps d'exécution uniquement pour les tests
        })(mov_list.slice(1));
      }
      else {
        Start_Cell = [0,0];
        Tree = {};
        players[Player+1].updateScore();
        Player = !Player;
        methods.update_player_frames();
        if (methods.check_winner(Color)) IsOver = true

      }
  },

  check_winner: function(player) {
    switch (player) {
      case 1:
        for (var R=0; R<4; R++) {
          if (M[16-R][C] != 1) return false ;
        }
        return true;
      case 2:
        for (var R=0; R<4; R++) {
          if (M[R][C] != 2)  return false ;
        }
        return true;
      case 3:
        for (var R=4; R<8; R++) {
          for (var C=R-4; C<=10-R; C+=2) {
            if (M[16-R][24-C] != 3) return false;
          }
        }
        return true;
      case 4:
        for (var R=4; R<8; R++) {
          for (var C=R-4; C<=10-R; C+=2) {
            if (M[R][C] != 4) return false;
          }
        }
        return true;
      case 5:
        for (var R=4; R<8; R++) {
          for (var C=R-4; C<=10-R; C+=2) {
            if (M[16-R][C] != 5) return false;
          }
        }
        return true;
      case 6:
        for (var R=4; R<8; R++) {
          for (var C=R-4; C<=10-R; C+=2) {
            if (M[R][24-C] != 6) return false;
          }
        }
        return true;
    }
  },

  // constructeur pour la classe Player
  Player: function(name, score, n_color, number, frame) {
    this.name = name;
    this.score = score;
    colors = [];
    for (var i=number; i<= 2*n_color; i+=2) {
      colors.push(i);
    }
    this.colors = colors;
    this.number = number;
    this.frame = frame;

    this.updateScore = function() {
      this.score += 1;
      this.frame.lastChild.innerHTML = ('score : ' + this.score);
    };

    this.createFrame = function() {  // crée un cadre pour les infos d'un joueur
        var frame = document.createElement('div');
        frame.className = 'player_info';
        frame.id = 'player' + this.number;
        var name = document.createElement('p');
        name.className = 'player_name';
        name.innerHTML = this.name;
        var score = document.createElement('p');
        score.className = 'player_score';
        score.innerHTML = ('score : ' + this.score);
        var colors = document.createElement('span');
        colors.className = 'player_colors';
        var code = '';
        for (var i=0, max=this.colors.length, color; i<max; i++) {
          color = this.colors[i];
           code += "<img alt='color' src='images/pion" + color + ".png' />"
        }
        colors.innerHTML = code;
        frame.appendChild(name);
        frame.appendChild(colors);
        frame.appendChild(score);
        document.getElementById('left_panel').appendChild(frame);
        this.frame = frame;
      };
  },

  // se déclenche à chaque clic sur une case du plateau
  play: function(event) {
    if (IsOver) return;
    methods.validate_movement(event.currentTarget);
  },

  in_board: function(x,y) {
    return (x > -1 && x < 17 && y > -1 && y<25);
  },

  update_player_frames: function() {
    var player_frames = document.querySelectorAll('.player_info');
    for (var i=0, max=player_frames.length; i<max; i++) {
      if (player_frames[i].id === 'player' + (Player+1)) {
        player_frames[i].style.border = '2px solid black';
      }
      else {
        player_frames[i].style.border = '2px dotted grey';
      }
    }
  },

  sound: function(src) {
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

// ***** infos des joueurs ***** (juste pour l'exemple, à récupérer via PHP)
n_color = sessionStorage.color_number;
ordi_player = sessionStorage.ordi_player;

var player1 = new methods.Player('Joueur1', 0, n_color, 1);
var player2 = new methods.Player('Joueur2', 0, n_color, 2);
var players = [false, player1, player2, false, false, false, false];

for (var i=1, max=players.length; i<=max; i++) {
  if (players[i]) {
    players[i].createFrame();
  }
}

methods.init_matrice();
methods.create_board();
methods.update_player_frames();
