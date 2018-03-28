var test = false; // true pour lancer un test
var testType = 1; /* valeurs possibles pour testType :
  1: teste la fonction check_winner()
  2: simule une partie à 2 joueurs 1 couleur
  3: teste la fonction make_move */

// ********************************** configuration nombre de joueur nombre de couleur (à récupérer via PHP) ***************************

var n_player = 2;   // si n_player=2, il faut définir n_color (1, 2 ou 3) sinon n_color= 2 pour 3 joueurs et 1 pour (4,6) joueur (par defaut)
var n_color = 1;

var Colors = {
  2: {
    1: [[1],[2]],
    2: [[1,3],[2,4]],
    3: [[1,3,5],[2,4,6]]
  },
  3: { 2: [[1,3],[4,5],[2,6]] },
  4: { 1: [[1],[2],[3],[4]] },
  6: { 1: [[1],[3],[6],[2],[4],[5]] }
}[n_player][n_color];

// ************************************* infos des joueurs (juste pour l'exemple, à récupérer via PHP)************


var players = []
for (var n=1; n<=n_player; n++) {
  var player = new Player('Joueur'+n,220,Colors[n-1], n);
  players.push(player);
}


// ******************************************* création du plateau de jeu ****************************************

var Player = 0;  // joueur symbolique
var IsOver = false; // partie terminée ?
var Start_Cell =  (0,0) ; // case départ pour un mouvement // pas de couples en JS
var Color;
// création de la matrice pour les parties finies
var isOver = [];
for (var i=0; i<n_player; i++) {   // 2 représente le  nombre de joueurs
  isOver[i] = [];
  for (var j=0; j<n_color; j++) {
    isOver[i][j] = false;
  }
}

var M,ID;

var Sounds = {
  jump : new sound("Sounds/click.mp3"),
  fail : new sound("Sounds/fail.mp3"),
  win : new sound("Sounds/win.mp3")
}

// ************************************************** tests automatisés *************************************************

if (!test) {
  restart();
}
else {
  switch (testType) {
    case 1: {

      // ***** ENVIRONNEMENT *****
      var testVars = {};
      M = [ // tous les joueurs ont gagné
      [false,false,false,false,false,false,false,false,false,false,false,false,  2  ,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,  2  ,false,  2  ,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,  2  ,false,  2  ,false,  2  ,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,  2  ,false,  2  ,false,  2  ,false,  2  ,false,false,false,false,false,false,false,false,false],
      [  4  ,false,  4  ,false,  4  ,false,  4  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false,  6  ,false,  6  ,false,  6  ,false,  6  ],
      [false,  4  ,false,  4  ,false,  4  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false,  6  ,false,  6  ,false,  6  ,false],
      [false,false,  4  ,false,  4  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false,  6  ,false,  6  ,false,false],
      [false,false,false,  4  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false,  6  ,false,false,false],
      [false,false,false,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false,false,false,false],
      [false,false,false,  5  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false,  3  ,false,false,false],
      [false,false,  5  ,false,  5  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false,  3  ,false,  3  ,false,false],
      [false,  5  ,false,  5  ,false,  5  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false,  3  ,false,  3  ,false,  3  ,false],
      [  5  ,false,  5  ,false,  5  ,false,  5  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false,  3  ,false,  3  ,false,  3  ,false,  3  ],
      [false,false,false,false,false,false,false,false,false,  1  ,false,  1  ,false,  1  ,false,  1  ,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,  1  ,false,  1  ,false,  1  ,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,  1  ,false,  1  ,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,  1  ,false,false,false,false,false,false,false,false,false,false,false,false]
      ]
      create_board() ;

      // ***** TESTS *****
//      for (var player=1; player<=6; player++) {
//        testVars.result = check_winner(player);
//        if (testVars.result) continue;
//        else console.log('ERROR: check_winner(' + player + ') is ' + testVars.result + ', should be true.');
//      }
//      break;

// la version suivante est adaptée au code actuel multijoueur inclus
      for (var player=1; player<=n_player; player++) {
        Player=player-1;
        for (color of Colors[player-1]) {
          check_winner(color);
        }
        testVars.result = (! (isOver[player-1].includes(false)))
        if (testVars.result) continue;
        else console.log('ERROR: check_winner(' + player + ') is ' + testVars.result + ', should be true.');
      }
      break;
    }

    case 2: {
      // ***** ENVIRONNEMENT *****
      var testVars = {};
      restart();

      testVars.clicks = [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11]]; // coordonnées des cases à cliquer

      // ***** TESTS *****
      for (var i=0, max = testVars.clicks.length; i<max; i++) {
        setTimeout(sim.simulate,100*i,ID[testVars.clicks[i][0]][testVars.clicks[i][1]], "click");
      }

      break;
    }

    case 3: {
      // ***** ENVIRONNEMENT *****
      var testVars = {};
      testVars.mov_list = [];
      testVars.last = [];
      testVars.M = M;

      for (var i=0, maxI=M.length; i<maxI; i++) {
        for (var j=0, maxJ=M[0].length; j<maxJ; j++) {
          testVars.mov_list.push([i,j]);
        }
      }
      testVars.mov_list = test.shuffle(testVars.mov_list);
      testVars.mov_list.unshift([8,12]);
      testVars.last = testVars.mov_list[testVars.mov_list.length-1];
      testVars.M[testVars.last[0]][testVars.last[1]] = 1;
      M[testVars.mov_list[1][0]][testVars.mov_list[1][1]] = 1; // pour Color

      // ***** TESTS *****
      make_move(testVars.mov_list);
      if (M !== testVars.M) console.log('ERROR: make_move(' + testVars.mov_list + ') is ' + M + ', should be ' + testVars.M);

      break;
    }
  }
}


// ***** fonctions pour les tests *****

var sim = {
  // simulate mouse click (https://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript)
  simulate: function (element, eventName) {
      var options = sim.extend(sim.defaultOptions, arguments[2] || {});
      var oEvent, eventType = null;
      for (var name in sim.eventMatchers) {
          if (sim.eventMatchers[name].test(eventName)) { eventType = name; break; }
      }
      if (!eventType)
          throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
      if (document.createEvent) {
          oEvent = document.createEvent(eventType);
          if (eventType == 'HTMLEvents') {
              oEvent.initEvent(eventName, options.bubbles, options.cancelable);
          }
          else {
              oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
              options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
              options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
          }
          element.dispatchEvent(oEvent);
      }
      else {
          options.clientX = options.pointerX;
          options.clientY = options.pointerY;
          var evt = document.createEventObject();
          oEvent = sim.extend(evt, options);
          element.fireEvent('on' + eventName, oEvent);
      }
      return element;
  },

  extend: function (destination, source) {
      for (var property in source)
        destination[property] = source[property];
      return destination;
  },

  eventMatchers: {
      'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
      'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
  },

  defaultOptions: {
      pointerX: 0,
      pointerY: 0,
      button: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      bubbles: true,
      cancelable: true
  },

  shuffle: function(array) { //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

};



// *********************************************** fonctions de jeu ************************************************

// initialise la matrice pour le plateau de jeu
function init_matrice() {
  var matrice = initArray(16,24,false);
  for (var R=0; R<4; R++) { // R pour row, C pour column
    for (var C=12-R; C<=12+R; C+=2) {
      matrice[R][C] = 1;
      matrice[16-R][C] = 2;
    }
  }
  for (var R=4; R<8; R++) {
    for (var C=12-R; C<=12+R; C+=2) {
      matrice[R][C] = -1;
      matrice[16-R][C] = -1;
    }
    for (var C=R-4; C<=10-R; C+=2) {
      matrice[R][C] = 3;
      matrice[16-R][24-C] = 4;
      matrice[R][24-C] = 5;
      matrice[16-R][C] = 6;
    }
  }
  for (var C=4; C<21; C+=2) { matrice[8][C] = -1 }
  return matrice;
}

// crée le plateau de jeu
function create_board() {
  var board = initArray(16,24,false);
  var line, cell;
  for (var R=0; R<17; R++) { // crée un div pour chaque ligne
    line = document.createElement('div');
    line.id = 'line'+R;
    line.className = 'line';
    document.getElementById('board').appendChild(line);
    for (var C=0; C<25; C++) { // crée un div pour chaque cellule
      if (M[R][C] !== false) {
        cell = create_cell(R, C, M[R][C]);
        line.appendChild(cell);
        board[R][C] = cell.firstChild; // identité de chaque image
      }
    }
  }
  return board;
}

// crée une case
function create_cell(R, C, option) {
  var cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('line', R);
  cell.setAttribute('column', C);
  // ajoute l'image de base pour la case
  cell.innerHTML = "<img alt='pion' src='images/pion" + M[R][C] + ".png' />";
  // gère l'event 'click'
  cell.addEventListener('click', play);
  return cell;
}

// fonction pour recommencer le jeu
function restart() {
  M = init_matrice() ;
  ID = create_board() ;
  Player=0;
  IsOver = false;
  Start_Cell =  (0,0) ;
  for (var i=0; i<n_player; i++) {   // 2 représente le  nombre de joueurs
    isOver[i] = [];
    for (var j=0; j<n_color; j++) {
      isOver[i][j] = false;
    }
  }
  for (var i=0, max=players.length; i<max; i++) {
    players[i].createFrame();
  }
  update_player_frames();
}

function validate_movement(cell) {
  var R = parseInt(cell.getAttribute('line'),10);
  var C = parseInt(cell.getAttribute('column'),10);
  if (Start_Cell === (0,0)) {                                     // premier click
    if (!(Colors[Player].includes(M[R][C]))) {                         // vérifie qu'on click sur le pion du joueur qui a la main
      send_msg("please click on your own pieces", Sounds.fail);
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
      {send_msg("Cell not empty!", Sounds.fail); return;}
    if (!(traject = get_traject(Start_Cell, R, C))) {            // mouvement invalide
      send_msg("Invalide Move!", Sounds.fail);
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
  var actuel = mov_list[1];
  M[previous[0]][previous[1]] = -1;
  M[actuel[0]][actuel[1]] = Color;
  ID[previous[0]][previous[1]].src = "images/pion-1.png";
  ID[actuel[0]][actuel[1]].src = "images/pion" + Color + ".png";
  Sounds.jump.play();
  if (mov_list.length > 2) {
    (function(mov_list) {
      setTimeout(function(){
        make_move(mov_list);
      }, 500);
    })(mov_list.slice(1));
  }
  else {
    check_winner(Color);
    if (! (isOver[Player].includes(false))) {
      IsOver = true;
      send_msg("le jouer"+ (Player+1) + " a gangé", Sounds.win)
    }
    players[Player].updateScore();
    Player = (Player+1)%n_player;
    Start_Cell = (0,0);
    update_player_frames();

  }
}

function check_winner(color) {
  switch (color) {
    case 1:
      for (var R=0; R<4; R++) {
        for (var C=12-R; C<=12+R; C+=2) {
          if (M[16-R][C] != 1) return ;
        }
      }
      for (var n=0; n< Colors[Player].length; n++) {
        if (Colors[Player] === color)
          isOver[Player][n]=true;
      }
    case 2:
      for (var R=0; R<4; R++) {
        for (var C=12-R; C<=12+R; C+=2) {
          if (M[R][C] != 2)  return ;
        }
      }
      for (var n=0; n< Colors[Player].length; n++) {
        if (Colors[Player][n] === color)
          isOver[Player][n]=true;
      }
    case 3:
      for (var R=4; R<8; R++) {
        for (var C=R-4; C<=10-R; C+=2) {
          if (M[16-R][24-C] != 3) return;
        }
      }
      for (var n=0; n< Colors[Player].length; n++) {
        if (Colors[Player][n] === color)
          isOver[Player][n]=true;
      }
    case 4:
      for (var R=4; R<8; R++) {
        for (var C=R-4; C<=10-R; C+=2) {
          if (M[R][C] != 4) return;
        }
      }
      for (var n=0; n< Colors[Player].length; n++) {
        if (Colors[Player][n] === color)
          isOver[Player][n]=true;
      }
    case 5:
      for (var R=4; R<8; R++) {
        for (var C=R-4; C<=10-R; C+=2) {
          if (M[16-R][C] != 5) return;
        }
      }
      for (var n=0; n< Colors[Player].length; n++) {
        if (Colors[Player][n] === color)
          isOver[Player][n]=true;
      }
    case 6:
      for (var R=4; R<8; R++) {
        for (var C=R-4; C<=10-R; C+=2) {
          if (M[R][24-C] != 6) return;
        }
      }
      for (var n=0; n< Colors[Player].length; n++) {
        if (Colors[Player][n] === color)
          isOver[Player][n]=true;
      }
  }
}


// constructeur pour la classe Player
function Player(name, score, colors, number, frame) {
    this.name = name;
    this.score = score;
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

function initArray(lignes, colonnes, valeur) {
  var array = [];
  for (var i=0; i<=lignes; i++) {
    array[i] = [];
    for (var j=0; j<=colonnes; j++) {
      array[i][j] = valeur;
    }
  }
  return array;
}
