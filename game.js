// création du plateau de jeu

var Fld = [['x','x','x','x','x','x','x','x','x','x','x','x',1,'x','x','x','x','x','x','x','x','x','x','x','x'],
            ['x','x','x','x','x','x','x','x','x','x','x',1,'x',1,'x','x','x','x','x','x','x','x','x','x','x'],
            ['x','x','x','x','x','x','x','x','x','x',1,'x',1,'x',1,'x','x','x','x','x','x','x','x','x','x'],
            ['x','x','x','x','x','x','x','x','x',1,'x',1,'x',1,'x',1,'x','x','x','x','x','x','x','x','x'],
            [2,'x',2,'x',2,'x',2,'x',0,'x',0,'x',0,'x',0,'x',0,'x',3,'x',3,'x',3,'x',3],
            ['x',2,'x',2,'x',2,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',3,'x',3,'x',3,'x'],
            ['x','x',2,'x',2,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',3,'x',3,'x','x'],
            ['x','x','x',2,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',3,'x','x','x'],
            ['x','x','x','x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x','x','x','x'],
            ['x','x','x',4,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',5,'x','x','x'],
            ['x','x',4,'x',4,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',5,'x',5,'x','x'],
            ['x',4,'x',4,'x',4,'x',0,'x',0,'x',0,'x',0,'x',0,'x',0,'x',5,'x',5,'x',5,'x'],
            [4,'x',4,'x',4,'x',4,'x',0,'x',0,'x',0,'x',0,'x',0,'x',5,'x',5,'x',5,'x',5],
            ['x','x','x','x','x','x','x','x','x',6,'x',6,'x',6,'x',6,'x','x','x','x','x','x','x','x','x'],
            ['x','x','x','x','x','x','x','x','x','x',6,'x',6,'x',6,'x','x','x','x','x','x','x','x','x','x'],
            ['x','x','x','x','x','x','x','x','x','x','x',6,'x',6,'x','x','x','x','x','x','x','x','x','x','x'],
            ['x','x','x','x','x','x','x','x','x','x','x','x',6,'x','x','x','x','x','x','x','x','x','x','x','x']];

var cell, cells = [], line;

for (var i = 0; i < 17; i++) {
  cells.push([]);
  line = document.createElement('div');
  line.id = 'line'+i;
  line.className = 'line';
  document.getElementById('board').appendChild(line);
  if (i%2) { // ligne impaire
    for (var j = 1; j < 25; j+=2) {
      cell = createCell(i,j);
      line.appendChild(cell);
      cells[i].push(cell);
    }
  }
  else { // ligne paire
    for (var j = 0; j < 25; j+=2) {
      cell = createCell(i,j);
      line.appendChild(cell);
      cells[i].push(cell);
    }
  }
}

function createCell(i,j) {
  var cell = document.createElement('div');
  var color = Fld[i][j];
  cell.classList.add('cell');
  cell.setAttribute('line',i);
  cell.setAttribute('column',j);
  // cell.setAttribute('color', color);
  cell.innerHTML = "<img alt='pion' src='images/pion" + color + ".png' />";
  if (color !== 'x') {
    cell.addEventListener('click', function() {
      clicked(this.getAttribute('line'), this.getAttribute('column'));
    });
  }
  return cell;
}

var currentPlayer = 1;
var I_Sel, J_Sel;

function clicked(i,j) {
  if (I_Sel || J_Sel) {
    Fld[I_Sel][J_Sel] = currentPlayer;
    I_Sel = J_Sel = null;
  }
  else {
    I_Sel = i;
    J_Sel = j;
    Fld[I_Sel][J_Sel] = currentPlayer*10;
  }
  refreshScreen();
}

function refreshScreen() {
  for (i=0, max=cells.length; i<max; i++) {
    for (j=0, max=cells[i].length; j<max; j++) {
      // cells[i][j].setAttribute('refreshed', true);
    }
  }
}

// infos des joueurs

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
  for (var i=0, max=player['colors'].length, color; i<max; i++) {
    color = player['colors'][i];
    colors.innerHTML += "<img alt='color' src='images/pion" + color + ".png' />"
  }
  frame.appendChild(name);
  frame.appendChild(colors);
  frame.appendChild(score);
  document.getElementById('left_panel').appendChild(frame);
}

function Player(name, score, colors) {
  this.name = name;
  this.score = score;
  this.colors = colors;
}

var player1 = new Player('Joueur1',220,[1,2,3]);
var player2 = new Player('Joueur2',190,[4,5,6]);
var players = [player1, player2];

for (var i=0, max=players.length; i<max; i++) {
  createPlayerFrame(players[i]);
}
