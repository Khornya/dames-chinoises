// plateau de jeu

var field = [['x','x','x','x','x','x','x','x','x','x','x','x',1,'x','x','x','x','x','x','x','x','x','x','x','x'],
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

var div, line;

for (var i = 0; i < 17; i++) {
  line = document.createElement('div');
  line.id = 'line'+i;
  line.className = 'line';
  document.getElementById('board').appendChild(line);

  if (i%2) { // ligne impaire
    line.classList.add('oddLine');

    for (var j = 1; j < 25; j+=2) {
      div = document.createElement('div');

      div.classList.add('cell');
      div.classList.add('line'+i);
      div.classList.add('column'+j);

      div.innerHTML = "<img alt='pion' src='images/pion" + field[i][j] + ".png' />";

      line.appendChild(div);
    }
  }
  else { // ligne paire
    line.classList.add('evenLine');

    for (var j = 0; j < 25; j+=2) {
      div = document.createElement('div');

      div.classList.add('cell');
      div.classList.add('line'+i);
      div.classList.add('column'+j);

      div.innerHTML = "<img alt='pion' src='images/pion" + field[i][j] + ".png' />";

      line.appendChild(div);
    }
  }
}
