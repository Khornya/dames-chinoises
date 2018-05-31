var share = require('./utils.js');
share.someSharedMethod();

var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);


var bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'pug');

var isInTestMode = true; // true pour lancer un test
var testName = 'sameTraject';
var testId = 999999;

app.post('/game', function(request, response) {
  if (typeof(request.body.inputNewGameForm) !== 'undefined' && typeof(request.body.inputJoinGameForm) !== 'undefined') {
    response.redirect('/');
  }
  else if (typeof(request.body.inputNewGameForm) !== 'undefined') {
    var numColors = escapeHtml(request.body.numColors);
    var numPlayers = escapeHtml(request.body.numPlayers);
    var player1 = (typeof(request.body.player1) !== 'undefined' && request.body.player1 !== '')? escapeHtml(request.body.player1) : "Joueur 1";
    var player2 = (typeof(request.body.player2) !== 'undefined' && request.body.player2 !== '')? escapeHtml(request.body.player2) : "Joueur 2";
    var player3 = (typeof(request.body.player3) !== 'undefined' && request.body.player3 !== '')? escapeHtml(request.body.player3) : "Joueur 3";
    var player4 = (typeof(request.body.player4) !== 'undefined' && request.body.player4 !== '')? escapeHtml(request.body.player4) : "Joueur 4";
    var player5 = (typeof(request.body.player5) !== 'undefined' && request.body.player5 !== '')? escapeHtml(request.body.player5) : "Joueur 5";
    var player6 = (typeof(request.body.player6) !== 'undefined' && request.body.player6 !== '')? escapeHtml(request.body.player6) : "Joueur 6";
    var ordi1 = escapeHtml(request.body.ordi1);
    var ordi2 = escapeHtml(request.body.ordi2);
    var ordi3 = escapeHtml(request.body.ordi3);
    var ordi4 = escapeHtml(request.body.ordi4);
    var ordi5 = escapeHtml(request.body.ordi5);
    var ordi6 = escapeHtml(request.body.ordi6);
    // Check form
    var players = [player1,player2,player3,player4,player5,player6];
    var userRegex = new RegExp("^[a-zA-Z0-9_-]{2,10}$");
    var defaultRegex = new RegExp("^Joueur [1-6]$");
    var namesFormatCheck = true;
    var namesDuplicatesCheck = true;
    for (var i=0; i<players.length; i++) {
      if (! userRegex.test(players[i]) || defaultRegex.test(players[i])) amesFormatCheck = false;
      for (var j=0; j<players.length; j++) {
        if (i === j) continue;
        if (players[i] === players[j]) namesDuplicatesCheck = false;
      }
    }
    if (numColors < 1 || numColors > 3) {
      response.send("<p>Vous devez choisir entre une et trois couleurs</p>");
    }
    else if (numPlayers === 3 && numColors !== 2 || numPlayers === 4 && numColors !== 1 || numPlayers === 6 && numColors !== 1 || numPlayers === 5 || numPlayers < 2 || numPlayers > 6) {
      response.send("<p>Ce mode de jeu n'est pas disponible</p>");
    }
    else if (!namesFormatCheck) {
      response.send("<p>Nom incorrect</p>");
    }
    else if (!namesDuplicatesCheck) {
      response.send("<p>Nom déjà pris</p>");
    }
    else {
      // Create a unique Socket.IO Room
      var gameId = ( Math.random() * 100000 ) | 0;
      response.render('game', {
        numPlayers: numPlayers,
        numColors: numColors,
        player1: player1,
        player2: player2,
        player3: player3,
        player4: player4,
        player5: player5,
        player6: player6,
        ordi1: ordi1,
        ordi2: ordi2,
        ordi3: ordi3,
        ordi4: ordi4,
        ordi5: ordi5,
        ordi6: ordi6,
        role: "host",
        gameId: gameId
      });
    }
  }
  else if (typeof(request.body.inputJoinGameForm) !== 'undefined') {
    var gameId = escapeHtml(request.body.roomID);
    var player = escapeHtml(request.body.player);
    var gameIdRegex = new RegExp("[0-9]{1-6}");
    var nameRegex = new RegExp("^[a-zA-Z0-9_-]{2,10}$");
    if (gameIdRegex.test(gameId) || gameId < 0 || gameId > 100000) {
      response.send("<p>N° de partie incorrect</p>");
    }
    else if (!nameRegex.test(player) && player !== '') {
      response.send("<p>Nom incorrect</p>");
    }
    else {
      if (!contains(Object.keys(games), gameId)) {
        response.send("<p>Cette partie n'existe pas.</p>");
      }
      else if (games[gameId]['remaining'] === 0) {
        response.send("<p>Cette partie est déjà complète.</p>");
      }
      else {
        response.render('game', {
          role: "guest",
          gameId: gameId,
          player1: player
        });
      }
    }
  }
  else {
    response.send("<p>Vous devez remplir au moins un des deux formulaires</p>");
  }
});

app.get('/score',function(request,response){
  if (Object.keys(request.query).length === 0 && request.query.constructor === Object) { // empty query
    response.redirect('/');
  }
  else {
    var name = request.query.name;
    var score = parseInt(request.query.score);
    var adversaire1 = request.query.adversaire1;
    var adversaire2 = request.query.adversaire2;
    var adversaire3 = request.query.adversaire3;
    var adversaire4 = request.query.adversaire4;
    var adversaire5 = request.query.adversaire5;
    var sql = "INSERT INTO parties (nom, score, adversaire1, adversaire2, adversaire3, adversaire4, adversaire5, dategame) VALUES ('" + name + "', " + score + ", '" + adversaire1 + "', '" + adversaire2 + "', '" + adversaire3 + "', '" + adversaire4 + "', '" + adversaire5 +  "', now())";
    connection.query(sql, function(error, rows, fields) {
      if (error) throw error;
    });
    response.sendStatus(200);
  }
});

var mysql = require('mysql');
var dbConfig = {
  host     : 'us-cdbr-iron-east-05.cleardb.net',
  user     : 'bb4e923f5faaa9',
  password : '382b4542',
  database : 'heroku_703605cd7a769b9',
  dateStrings: 'date'
};

var connection;

function handleDisconnect() { // https://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection
  connection = mysql.createConnection(dbConfig); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(error) {              // The server is either down
    if(error) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', error);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(error) {
    console.log('db error', error);
    if(error.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw error;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

var PORT = (process.env.PORT || 8000);

server.listen(PORT);

app.get('/', function(request, response) {
  connection.query('SELECT nom, score, dategame FROM parties ORDER BY score ASC LIMIT 0, 10', function(error, rows, fields) {
    if (error) throw error;
    response.render('index', {
      score1: rows[0],
      score2: rows[1],
      score3: rows[2],
      score4: rows[3],
      score5: rows[4],
      score6: rows[5],
      score7: rows[6],
      score8: rows[7],
      score9: rows[8],
      score10: rows[9]
    });
  });
});

app.get('/game', function (request, response) {
  response.redirect('/');
});

app.use(express.static(__dirname));

var games = {};

var clients = {};

io.on('connection', function (socket) {
  socket.on('create game', function (data) {
    console.log("create game : ", data);
    var numHumanPlayers = 0;
    for (var i=0, max=data["isPlayedByIa"].length; i<max; i++){
      if (!data["isPlayedByIa"][i]) numHumanPlayers++;
    }
    games[data["gameId"]] = {
      numPlayers: data["numPlayers"],
      numColors: data["numColors"],
      COLORS: data["COLORS"],
      player1: data["player"],
      PLAYERS: [],
      isPlayedByIa: data["isPlayedByIa"],
      numHumanPlayers: numHumanPlayers,
      remaining: numHumanPlayers-1,
      isIaPlaying: false,
      restartCount: 0
    };
    // Join the Room and wait for the players
    socket.join(data["gameId"].toString());
    clients[this.id] = {
      gameId: data["gameId"],
      number: 0,
      name: data["player"]
    };
    if (games[data["gameId"]]["PLAYERS"].length + 1 === games[data["gameId"]]["numHumanPlayers"]) {
      var PLAYERS = games[data["gameId"]]["PLAYERS"];
      for (i=2; i<=games[data["gameId"]]["numPlayers"]; i++) {
        if (!games[data["gameId"]]["isPlayedByIa"][i-1]) {
          // games[data["gameId"]]["player"+i] = (typeof(PLAYERS[0]) !== 'undefined' && PLAYERS[0] !== '')? PLAYERS.shift() : "Joueur " + i;
        }
        else {
          games[data["gameId"]]["player"+i] = "Ordinateur";
        }
      }
      delete games[data["gameId"]]["PLAYERS"];
      init(data["gameId"]);
      if (isInTestMode) {
        tests[testName].runTest();
      }
      io.sockets.in(data["gameId"]).emit('game full', games[data["gameId"]]);
    }
  });
  socket.on('join game', function (data) {
    console.log('join game : ', data);
    if (data["player"] !== '' && contains(games[data["gameId"]]["PLAYERS"], data["player"]) || data["player"] === (games[data["gameId"]]["player1"])) {
      socket.emit('name error', { name: data["player"] });
      return;
    }
    socket.join(data["gameId"].toString());
    games[data["gameId"]]['remaining'] -= 1;
    games[data["gameId"]]["PLAYERS"].push(data["player"]);
    var n = games[data["gameId"]]["PLAYERS"].length;
    clients[this.id] = {
      gameId: data["gameId"],
      number: n,
      name: data["player"]
    };
    games[data["gameId"]]["player"+(n+1)] = (data["player"] !== '')? data["player"] : "Joueur" + (n+1);
    if (games[data["gameId"]]["PLAYERS"].length + 1 === games[data["gameId"]]["numHumanPlayers"]) {
      var PLAYERS = games[data["gameId"]]["PLAYERS"];
      for (i=2; i<=games[data["gameId"]]["numPlayers"]; i++) {
        if (!games[data["gameId"]]["isPlayedByIa"][i-1]) {
          // games[data["gameId"]]["player"+i] = (typeof(PLAYERS[0]) !== 'undefined' && PLAYERS[0] !== '')? PLAYERS.shift() : "Joueur " + i;
        }
        else {
          games[data["gameId"]]["player"+i] = "Ordinateur";
        }
      }
      delete games[data["gameId"]]["PLAYERS"];
      init(data["gameId"]);
      if (isInTestMode) {
        tests[testName].runTest();
      }
      io.sockets.in(data["gameId"]).emit('game full', games[data["gameId"]]);
    }
  });
  socket.on('move request', function (data) {
    console.log('move request : ', data);
    play(clients[this.id]["gameId"], this, data["cell"]);
  });
  socket.on('disconnecting', function (reason) {
    if (contains(Object.keys(clients), this.id)) {
      io.sockets.in(clients[this.id]["gameId"]).emit('player disconnecting', clients[this.id]);
      if (!games[clients[this.id]["gameId"]]["gameOver"]) {
        games[clients[this.id]["gameId"]]["gameOver"] = true;
        io.sockets.in(clients[this.id]["gameId"]).emit('end game', {});
      }
    }
  });
  socket.on('disconnect', function (reason) {
    if (contains(Object.keys(clients), this.id) && !contains(Object.keys(io.sockets.adapter.rooms), clients[this.id]["gameId"].toString())) {
      console.log('deleting game ', clients[this.id]["gameId"]);
      delete games[clients[this.id]["gameId"]];
    }
  });
  socket.on('restart request', function () {
    games[clients[this.id]["gameId"]]["restartCount"] += 1;
    if (games[clients[this.id]["gameId"]]["restartCount"] === games[clients[this.id]["gameId"]]["numHumanPlayers"]) {
      restart(clients[this.id]["gameId"],1);
      console.log('restarting : ', clients[this.id]["gameId"]);
      io.sockets.in(clients[this.id]["gameId"]).emit('restart game', {});
    }
  });
});


var TRIANGLES_COORDS = [
 [[0,12],[1,11],[1,13],[2,10],[2,12],[2,14],[3,9],[3,11],[3,13],[3,15]],
 [[16,12],[15,11],[15,13],[14,10],[14,12],[14,14],[13,9],[13,11],[13,13],[13,15]],
 [[4,0],[4,2],[4,4],[4,6],[5,1],[5,3],[5,5],[6,2],[6,4],[7,3]],
 [[12,24],[12,22],[12,20],[12,18],[11,23],[11,21],[11,19],[10,22],[10,20],[9,21]],
 [[4,24],[4,22],[4,20],[4,18],[5,23],[5,21],[5,19],[6,22],[6,20],[7,21]],
 [[12,0],[12,2],[12,4],[12,6],[11,1],[11,3],[11,5],[10,2],[10,4],[9,3]]
];

// initialise la matrice pour le plateau de jeu
function initGameBoard() {
  var matrice = initArray(17,25,false);
  for (var row=0; row<4; row++) {
    for (var col=12-row; col<=12+row; col+=2) {
      matrice[row][col] = 1;
      matrice[16-row][col] = 2;
    }
  }
  for (var row=4; row<8; row++) {
    for (var col=12-row; col<=12+row; col+=2) {
      matrice[row][col] = -1;
      matrice[16-row][col] = -1;
    }
    for (var col=row-4; col<=10-row; col+=2) {
      matrice[row][col] = 3;
      matrice[16-row][24-col] = 4;
      matrice[row][24-col] = 5;;
      matrice[16-row][col] = 6;
    }
  }
  for (var col=4; col<21; col+=2) { matrice[8][col] = -1 }
  return matrice;
}


// fonction pour recommencer le jeu
function init(gameId) {
  games[gameId]["gameBoard"] = initGameBoard();
  games[gameId]["PLAYERS"] = [];
  for (var n=1; n<=games[gameId]["numPlayers"]; n++) {
    games[gameId]["PLAYERS"].push({
      name: games[gameId]["player"+n],
      score: 0,
      colors: games[gameId]["COLORS"][n-1],
      number: n
    });
  }
  games[gameId]["Time"] = 500;
  restart(gameId);
}


function restart(gameId) {
  games[gameId]["gameBoard"] = initGameBoard();
  for (var n=0; n < games[gameId]["numPlayers"]; n++) {
    games[gameId]["PLAYERS"][n].score = 0;
  }
  games[gameId]["player"] = 0;
  games[gameId]["startCell"] =  (0,0);
  games[gameId]["gameOver"] = false;
  games[gameId]["gameState"] = initArray(games[gameId]["numPlayers"], games[gameId]["numColors"], false);
  games[gameId]["history"] = initArray(games[gameId]["numPlayers"], 0, false);
  games[gameId]["restartCount"] = 0;
}

function isMovingBackward(color, startCell, endCell) {
  // remplacer par switch ?
  if (color===1)  return endCell[0] - startCell[0] < 0;
  if (color===2)  return endCell[0] - startCell[0] > 0;
  if (color===3) return endCell[1] + endCell[0] - startCell[1] - startCell[0] < 0;
  if (color===4) return endCell[1] + endCell[0] - startCell[1] - startCell[0] > 0;
  if (color===5) return endCell[1] - endCell[0] - startCell[1] + startCell[0] > 0;
  if (color===6) return endCell[1] - endCell[0] - startCell[1] + startCell[0] < 0;
}


function sameTraject(gameId, path) { // utile ? myArray.reverse()
  var i, j;
  i = path.length;
  j = i-1;
  last = games[gameId]["history"][games[gameId]["player"]];
  if (i !== last.length) return false;
  while (i--) {
    if (path[j-i][0] !== last[i][0] ||
       path[j-i][1] !== last[i][1])
       return false;
   }
   return true;
}

function getPath(gameId, startCell, endCell) {
  games[gameId]["reachableCells"] = [];                                  // init reachableCells
  var row = startCell[0];
  var col = startCell[1];
  var i, j;
  for (i =row-1; i <= row+1; i++)  {               // add mouvement adjaçant
    for (j=col-2; j<= col+2; j++) {
       if ((i!=row || j!=col) && isOnGameBoard([i,j]) && games[gameId]["gameBoard"][i][j]== -1){
         if(! isMovingBackward(games[gameId]["playedColor"], [row,col], [i,j]) &&
               ! sameTraject(gameId, [startCell, [i,j]]))
            games[gameId]["reachableCells"].push([i,j]);                    // used by IA
         if (i==endCell[0] && j==endCell[1]) return [startCell,[i,j]];
       }
    }
  }
  return getJumps(gameId, [startCell], endCell) ;
}



function getJumps(gameId, cells , endCell, oldPath=[]) {
  if (cells.length<1) return false;
  var i, j, k;
  var pivotRow , pivotCol;
  var n, index;
  var access_cell = []
  var row = cells[0][0]; var col = cells[0][1];

  // chercher saut sur ligne + diagonal 6 directions :
  for (i=-1; i<2; i++) {     // i in [-1, 0, 1]
    for (j=-1; j<2; j+=2) {  // j in [-1, 1]
      pivotRow = row+i;
      pivotCol = col+j;
      while (isOnGameBoard([pivotRow, pivotCol]) && games[gameId]["gameBoard"][pivotRow][pivotCol] < 1) { // avancer jusqu'a case occupée
        pivotRow += i;
        pivotCol += j;
      }
      n=0;
      for (k=1; k< j*(pivotCol-col); k+=1) {
        if (!isOnGameBoard([pivotRow+i*k, pivotCol+j*k])) break;
        if (games[gameId]["gameBoard"][pivotRow+i*k][pivotCol+j*k] > 0) n+=1; // si un autre pion sur le chemin break
      }
      if (n===0) {
        index_r = 2*pivotRow-row;   //(quand i=0; , pivotRow=row ; 2*row-row=row (on reste sur la même la ligne)
        index_c = 2*pivotCol-col;
        if (contains(oldPath,[index_r, index_c])) continue ; // éviter de tourner rond
        if (isOnGameBoard([index_r, index_c]) && games[gameId]["gameBoard"][index_r][index_c] === -1) { // si la case en asymétrie est vide valide:
          if(! isMovingBackward(games[gameId]["playedColor"], [row,col], [index_r,index_c]) &&
               ! sameTraject(gameId, oldPath.concat([[row,col], [index_r, index_c]])))
            games[gameId]["reachableCells"].push([index_r, index_c])
          if (index_r==endCell[0] && index_c==endCell[1]) return oldPath.concat([[row,col], [index_r, index_c]]);
          else access_cell.push([index_r, index_c]);
        }
      }
    }
  }
  return (getJumps(gameId, cells.slice(1), endCell, oldPath) ||
          getJumps(gameId, access_cell, endCell, oldPath.concat([cells[0]])));
}


function hasWon(gameId, color) {
  var row, col;
  var n =  (color%2 ? color : color-2);
  for (var i=0; i<10; i++) {
    row = TRIANGLES_COORDS[n][i][0];
    col = TRIANGLES_COORDS[n][i][1]
    if (games[gameId]["gameBoard"][row][col] != color) return false ;
  }
  for (n=0; n< games[gameId]["COLORS"][games[gameId]["player"]].length; n++) {
    if (games[gameId]["COLORS"][games[gameId]["player"]][n] === color)
      games[gameId]["gameState"][games[gameId]["player"]][n]=true;
  }
  return (! (games[gameId]["gameState"][games[gameId]["player"]].includes(false)))
}


function isOnGameBoard(cell) {
  return (cell[0] > -1 && cell[0] < 17 && cell[1] > -1 && cell[1] < 25);
}


function contains(array, element) {
  var i = array.length;
  while (i--) {
    if (array[i][0]==element[0] && array[i][1] == element[1]) {
      return true;
    }
  }
  return false;
}


function initArray(lines, columns, value) {
  var array = [];
  for (var i=0; i<lines; i++) {
    if (columns) {
      array[i] = [];
      for (var j=0; j<columns; j++) {
        array[i][j] = value;
      }
    }
    else array[i] = value;
  }
  return array;
}

function sendScore(gameId, winner) {
  var name = encodeURIComponent(winner.name);
  var score = encodeURIComponent(winner.score);
  var adversaires = games[gameId]["PLAYERS"].filter(item => item !== winner);
  adversaires.forEach(function(value, index, array) {
    array[index] = encodeURIComponent(value.name);
  })
  http.get('http://hop-hop-hop.herokuapp.com/score?name=' + name + '&score=' + score + '&adversaire1=' + adversaires[0] + '&adversaire2=' + adversaires[1] + '&adversaire3=' + adversaires[2] + '&adversaire4=' + adversaires[3] + '&adversaire5=' + adversaires[4], function(response) {
   var data = ''; //This will store the page we're downloading.
   response.on('data', function(chunk) { //Executed whenever a chunk is received.
        data += chunk; //Append each chunk to the data variable.
   });
  response.on('end', function() {
      console.log('envoi des scores à la BDD :', data);
  });
 }).end();
}

function makeBestMove(gameId) {
  if (!games[gameId]["isPlayedByIa"][games[gameId]["player"]]) return;
  if (games[gameId]["gameOver"]) return;       // Isover
  games[gameId]["isIaPlaying"] = true;
  var i, j, k;             // var pour itération
  var maxWeight=-99, selectedMove; // meilleur poid et chemin depart arrivé correspondant
  var x, y, x0, y0, weight=0, n;
  var xDirection , yDirection, axis, axis0;         // géométrie
  var count=0;                  // pour avoir une idée sur le nombre d'itération
  for( i = 0; i<17; i++) {  // parcourt du plateau
    for (j=0 ; j<25; j++) {
      if(games[gameId]["COLORS"][games[gameId]["player"]].includes(games[gameId]["gameBoard"][i][j])) {       // si pion de l'IA
        games[gameId]["playedColor"]=games[gameId]["gameBoard"][i][j];                        // fait semblant qu'on va le déplacer
        games[gameId]["gameBoard"][i][j]=-1;                           //  (i, j) cellule depart
        getPath(gameId, [i,j], [-1,-1]);           // set in reachableCells all reachable cell
        games[gameId]["gameBoard"][i][j]=games[gameId]["playedColor"];                        // rétablir la valeur initiale
        for(k=0; k< games[gameId]["reachableCells"].length; k++){       // set weight // compare  (pour toute cellule accesible accorde un poid
          n =  (games[gameId]["playedColor"]%2 ? games[gameId]["playedColor"] : games[gameId]["playedColor"]-2);
          x0= TRIANGLES_COORDS[n][0][0] ;y0= TRIANGLES_COORDS[n][0][1]  // (x0, y0) pointe du triangle opposé // on souhaite diminuer au max la distance
          xDirection = (games[gameId]["playedColor"]%2 ? 1: -1) ;               // dans quelle direction vont les x? selon les couleur (1, 3, 5 direction +1, 2, 4, 6 direction -1
          yDirection = (games[gameId]["playedColor"]%3 ? (games[gameId]["playedColor"]<3 ? 0 : -1) : 1); // dans quelle direction vont les y? selon les couleur (1, 2:aucun effet 3,6: +1 4, 5:-1
          axis = -3*xDirection*yDirection;                            // ce code trouve l'equation de la droite allant de la pointe du home a la pointe de l'opposé
          axis0 = -axis*8-12;
          count+=1
          x = games[gameId]["reachableCells"][k][0];  y = games[gameId]["reachableCells"][k][1];  // (x, y) cellule accesible a partir de (i, j)
          weight  = 10* (xDirection*(x-i)+yDirection*(y-j));                                // main direction, selon les option xDirection, et yDirection
          weight += 10* (Math.pow((i-x0), 2) + Math.pow((j-y0), 2)/3);    // max distance from depart
          weight -= 10* (Math.pow((x-x0), 2) + Math.pow((y-y0), 2)/3);    // min distance de la case accesible à la pointe (ds le meilleur cas val=0
          // le code suivant pour rester sur la ligne droite entre le home et l'oppossé
          weight += 15* (Math.pow(axis*i+j+axis0, 2)/(Math.pow(axis, 2)+3));    // privilégier le spions les plus éloignés
          weight -= 15* (Math.pow(axis*x+y+axis0, 2)/(Math.pow(axis, 2)+3));    // privilégier les positions les plus proches
          if (weight > maxWeight) {                                                      // compare
            maxWeight = weight;
            selectedMove = [[i, j], x, y];
          }
        }
      }
    }
  }
  games[gameId]["playedColor"] = games[gameId]["gameBoard"][selectedMove[0][0]][selectedMove[0][1]];                                    // ici on valide le meilleur choix
  console.log(count + " scénario evaluated");
  games[gameId]["gameBoard"][selectedMove[0][0]][selectedMove[0][1]]=-1;
  path = getPath(gameId, selectedMove[0], [selectedMove[1],selectedMove[2]]);
  games[gameId]["history"][games[gameId]["player"]] = path;
  games[gameId]["Time"] += 500*(path.length)
  move(gameId, path, games[gameId]["playedColor"]);
  setTimeout(function() {
    io.sockets.in(gameId).emit('move', { path : path, playedColor: games[gameId]["playedColor"] });
    games[gameId]["isIaPlaying"] = false;
  }, games[gameId]["Time"]);
  games[gameId]["PLAYERS"][games[gameId]["player"]].score += 1;
  if (hasWon(gameId, games[gameId]["playedColor"])) {
    games[gameId]["gameOver"] = true;
    io.sockets.in(gameId).emit('end game', { winner: games[gameId]["player"], score: games[gameId]["PLAYERS"][games[gameId]["player"]].score });
    sendScore(gameId, games[gameId]["PLAYERS"][games[gameId]["player"]]);
    return true;
  }
  games[gameId]["player"] = (games[gameId]["player"]+1) % games[gameId]["numPlayers"];
  setTimeout(function() { io.sockets.in(gameId).emit('new turn', { player: games[gameId]["player"] }); }, games[gameId]["Time"]);
  games[gameId]["startCell"] = (0,0);
}

function validateMove(gameId, socket, cell) {
  var player = games[gameId]["player"];
  if (player !== clients[socket.id]["number"] || games[gameId]["isIaPlaying"]) {
    socket.emit('game error', { message: 'wait for your turn', sound: "fail" });
    return;
  }
  var row = cell[0];
  var col = cell[1];
  var startCell = games[gameId]["startCell"];
  var COLORS = games[gameId]["COLORS"];
  var playedColor = games[gameId]["playedColor"];
  var gameBoard = games[gameId]["gameBoard"];
  var history = games[gameId]["history"];
  var Time = games[gameId]["Time"];
  var isPlayedByIa = games[gameId]["isPlayedByIa"];
  if (startCell === (0,0)) {                                     // premier click
    if (!(COLORS[player].includes(gameBoard[row][col]))) {                    // vérifie qu'on click sur le pion du joueur qui a la main
      if (!isPlayedByIa[player]) socket.emit('game error', { message: "please click on your own pieces", sound: "fail" });
      else socket.emit('game error', { message: "please wait until computer finish playing", sound: "fail" });
      return false;
    }
    games[gameId]["startCell"] = [row,col];
    socket.emit('select', { cell : [row,col] });
    games[gameId]["playedColor"] = gameBoard[row][col];
    games[gameId]["gameBoard"][row][col] = -1;
    return false;                                               // marquer la case depart vide pour ne pas l'utiliser comme pivot dans getJumps()
  }
  else {
    if (startCell[0] === row && startCell[1] === col) {            // retour à la case départ annule le mouvement
      games[gameId]["gameBoard"][row][col] = playedColor;
      games[gameId]["startCell"] = (0,0);
      socket.emit('deselect', { cell : [row,col], color: playedColor });
      return false;
    }
    if (gameBoard[row][col] !== -1) {                                        // cell not empty
      socket.emit('game error', { message: "Cell not empty!", sound: "fail" });
      return false;
    }
    if (isMovingBackward(playedColor, startCell, [row,col])) {    // mouvement illégal en réculant
      socket.emit('game error', { message: "You can't go back!", sound: "fail" });
      return false;
    }
    if (!(path = getPath(gameId, startCell, [row,col]))) {            // mouvement invalide
      socket.emit('game error', { message: "Invalid move!", sound: "fail" });
      return false;
    }
    if (sameTraject(gameId, path)) {
      socket.emit('game error', { message: "You can't replay the last move", sound: "fail" });
      return false;
    }
    games[gameId]["history"][player] = path;
    games[gameId]["Time"] = 500*(path.length-1);
    move(gameId, path, games[gameId]["playedColor"]);
    io.sockets.in(gameId).emit('move', { path : path, playedColor: games[gameId]["playedColor"] });
    games[gameId]["PLAYERS"][player].score += 1;
    if (hasWon(gameId, playedColor)) {
      games[gameId]["gameOver"] = true;
      io.sockets.in(gameId).emit('end game', { winner: player, score: games[gameId]["PLAYERS"][player].score });
      sendScore(gameId, games[gameId]["PLAYERS"][player]);
      return true
    }
    games[gameId]["player"] = (player+1) % games[gameId]["numPlayers"];
    io.sockets.in(gameId).emit('new turn', { player: games[gameId]["player"] })
    games[gameId]["startCell"] = (0,0);
    return true;
  }
}

function play(gameId, socket, cell) {
  if (games[gameId]["gameOver"]) return;
  if (!games[gameId]["isPlayedByIa"][games[gameId]["player"]])
    if (! validateMove(gameId, socket, cell)) return ;
  setTimeout(function() { makeBestMove(gameId); }, games[gameId]["Time"]);
  if (games[gameId]["isPlayedByIa"][(games[gameId]["player"]+1)%games[gameId]["numPlayers"]]) {
    setTimeout(function() { play(gameId); }, games[gameId]["Time"]);
  }
  games[gameId]["Time"] = 500;
}

function move(gameId, path, playedColor) {
  var previous = path[0];
  var actuel = path[1];
  games[gameId]["gameBoard"][previous[0]][previous[1]] = -1;
  games[gameId]["gameBoard"][actuel[0]][actuel[1]] = playedColor;
  if (path.length > 2) {
    move(gameId, path.slice(1), playedColor);
  }
  else {

  }
}

function escapeHtml(text) {
  if (typeof(text) === 'undefined') return text
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}


var tests = {
  validateMove : {

      runTest : function() {
        restart();
        console.log('There should be an alert \'Please click on your own pieces\'');
        validateMove(ID[16][12].parentNode);
        console.log('Cell 3,11 should be selected');
        validateMove(ID[3][11].parentNode);
        if (M[3][11] !== -1) console.log('M[3][11] is ',M[3][11], ', should be -1');
        console.log('There should be an alert \'Cell not empty\'');
        validateMove(ID[2][12].parentNode);
        validateMove(ID[3][11].parentNode);
        validateMove(ID[2][12].parentNode);
        validateMove(ID[4][14].parentNode);
        validateMove(ID[14][14].parentNode);
        validateMove(ID[12][12].parentNode);
        validateMove(ID[3][13].parentNode);
        console.log('There should be an alert \'You can\'t go back\'');
        validateMove(ID[2][12].parentNode);
        validateMove(ID[3][13].parentNode);
        validateMove(ID[4][14].parentNode);
        console.log('There should be an alert \'You can\'t replay the last move\'');
        validateMove(ID[2][12].parentNode);
        console.log('There should be an alert \'Invalid move !\'');
        validateMove(ID[6][14].parentNode);
      }
    },

  sameTraject : {

      runTest : function() {
        var tests = {
          1: {
            history : [[8,12],[4,16],[4,8],[6,10],[8,8],[14,14],[16,12]],
            traject : [[8,12],[4,16],[4,8],[6,10],[8,8],[14,14],[16,12]].reverse(),
            expected : true
          },
          2: {
            history : [[8,12],[4,16],[4,8],[6,10],[8,8],[14,14],[16,12]],
            traject : [[16,12],[14,14]],
            expected : false
          },
          3: {
            history : [[8,12],[4,16]],
            traject : [[16,12],[14,14]],
            expected : false
          }
        };
        var result;
        for (var i=1, max=Object.keys(tests).length;i<=max; i++) {
          games[testId] = {};
          games[testId]["player"] = 0;
          games[testId]["history"] = [];
          games[testId]["history"][games[testId]["player"]] = tests[i].history;
          result = sameTraject(testId, tests[i].traject);
          if (result === tests[i].expected) {
            console.log('test ' + i + ' : SUCCESS');
          }
          else {
            console.log('test ' + i + ' : FAIL');
            console.log('result is ', result, ', should be ', tests[i].expected);
          }
        }
      }

    },

    getPath : {

      runTest : function() {
        var tests = {
          1: {
            start : [8,12],
            pions : [[4,12],[5,9],[6,14],[7,9],[11,11],[15,13]],
            cases : [[16,12],[9,13],[13,9]],
            expected : [[[8,12],[4,16],[4,8],[6,10],[8,8],[14,14],[16,12]],[[8,12],[9,13]],false]
          }
        };
        var coordCase = coordPion = result = [];
        for (var i=1, max=Object.keys(tests).length;i<=max; i++) {
          result = [];
          // etoile vide
          M = [
            [false, false, false, false, false, false, false, false, false, false, false, false, -1, false, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false],
            [-1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1],
            [false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false],
            [false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false],
            [false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false],
            [false, false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false, false],
            [false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false],
            [false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false],
            [false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false],
            [-1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1],
            [false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, false, -1, false, false, false, false, false, false, false, false, false, false, false, false]
          ];
          // positionne un pion
          M[tests[i].start[0]][tests[i].start[1]] = 1;
          // positionne les pivots potentiels
          for (var j=0; j < tests[i].pions.length; j++){
            coordPion = tests[i].pions[j];
            M[coordPion[0]][coordPion[1]] = 2;
          }
          for (var k=0; k < tests[i].cases.length; k++) {
            coordCase = tests[i].cases[k];
            result.push(getPath(tests[i].start,coordCase[0],coordCase[1]));
          }
          if (JSON.stringify(result) == JSON.stringify(tests[i].expected)) {
            console.log('test ' + i + ' : SUCCESS');
          }
          else {
            console.log('test ' + i + ' : FAIL');
            console.log('result is ', result, ', should be ', tests[i].expected);
          }
        }
      }
    },

    isMovingBackward : {
      runTest : function() {
        var tests = {
          1: {
            expected : [true,true,false,false,false,false]
          },
          2: {
            expected : [false,false,false,true,true,false]
          },
          3: {
            expected : [true,false,false,false,false,true]
          },
          4: {
            expected : [false,false,true,true,false,false]
          },
          5: {
            expected : [false,true,true,false,false,false]
          },
          6: {
            expected : [false,false,false,false,true,true]
          }
        };
        var result = [];
        for (var i=1, max=Object.keys(tests).length;i<=max; i++) {
          result = [];
          // etoile vide
          M = [
            [false, false, false, false, false, false, false, false, false, false, false, false, -1, false, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false],
            [-1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1],
            [false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false],
            [false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false],
            [false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false],
            [false, false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false, false],
            [false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false],
            [false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false],
            [false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false],
            [-1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1],
            [false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, false, -1, false, false, false, false, false, false, false, false, false, false, false, false]
          ];
          // positionne un pion
          M[8][12] = i;
          var cases = [[7,11],[7,13],[8,14],[9,13],[9,11],[8,10]];
          for (var j=0; j < cases.length; j++) {
            result.push(isMovingBackward(i,8,12,cases[j][0],cases[j][1]));
          }
          if (JSON.stringify(result) == JSON.stringify(tests[i].expected)) {
            console.log('test ' + i + ' : SUCCESS');
          }
          else {
            console.log('test ' + i + ' : FAIL');
            console.log('result is ', result, ', should be ', tests[i].expected);
          }
        }
      }

    },

    getJumps : {

      runTest : function() {
        var tests = {
          1: {
            start : [8,12],
            pions : [[6,12],[7,11],[7,13],[8,10],[8,14],[9,11],[9,13],[10,12]],
            cases : [[4,12],[6,14],[8,16],[10,14],[12,12],[10,10],[8,8],[6,10]],
            expected : [false, [[8,12],[6,14]], [[8,12],[8,16]], [[8,12],[10,14]], false, [[8,12],[10,10]], [[8,12],[8,8]], [[8,12],[6,10]]]
          },
          2: {
            start : [8,12],
            pions : [[4,12],[6,14],[8,16],[10,14],[12,12],[10,10],[8,8],[6,10]],
            cases : [[0,12],[4,16],[8,20],[12,16],[16,12],[12,8],[8,4],[4,8]],
            expected : [false, [[8,12],[4,16]], [[8,12],[8,20]], [[8,12],[12,16]], false, [[8,12],[12,8]], [[8,12],[8,4]], [[8,12],[4,8]]]
          },
          3: {
            start : [12,16],
            pions : [[8,12],[8,20],[12,8]],
            cases : [[4,8],[4,24],[12,0]],
            expected : [[[12,16],[4,8]], [[12,16],[4,24]], [[12,16],[12,0]]]
          },
          4: {
            start : [12,16],
            pions : [[8,12],[8,20],[12,8],[5,9],[12,2],[5,23]],
            cases : [[4,8],[4,24],[12,0]],
            expected : [false,false,false]
          },
          5: {
            start : [8,20],
            pions : [[9,17],[12,16],[10,12],[13,9]],
            cases : [[8,16]],
            expected : [[[8, 20],[16, 12],[10, 6],[10, 18],[8, 16]]]
          },
        };
        var coordCase = coordPion = result = [];
        for (var i=1, max=Object.keys(tests).length;i<=max; i++) {
          result = [];
          // etoile vide
          M = [
            [false, false, false, false, false, false, false, false, false, false, false, false, -1, false, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false],
            [-1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1],
            [false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false],
            [false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false],
            [false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false],
            [false, false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false, false],
            [false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false],
            [false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false],
            [false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false],
            [-1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1],
            [false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, -1, false, -1, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, false, -1, false, false, false, false, false, false, false, false, false, false, false, false]
          ];
          // positionne un pion
          M[tests[i].start[0]][tests[i].start[1]] = 1;
          // positionne les pivots potentiels
          for (var j=0; j < tests[i].pions.length; j++){
            coordPion = tests[i].pions[j];
            M[coordPion[0]][coordPion[1]] = 2;
          }
          for (var k=0; k < tests[i].cases.length; k++) {
            coordCase = tests[i].cases[k];
            result.push(getJumps([tests[i].start],coordCase[0],coordCase[1]));
          }
          if (JSON.stringify(result) == JSON.stringify(tests[i].expected)) {
            console.log('test ' + i + ' : SUCCESS');
          }
          else {
            console.log('test ' + i + ' : FAIL');
            console.log('result is ', result, ', should be ', tests[i].expected);
          }
        }
      }

    },

    hasWon : {

      M : [ // tous les joueurs ont gagné
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
    ],

      runTest : function() {
        var tests = {
          1 : {
            numPlayers : 6,
            numColors : 1,
            expected : [true,true,true,true,true,true]
          },
          2 : {
            numPlayers : 4,
            numColors : 1,
            expected : [true,true,true,true]
          },
          3 : {
            numPlayers : 3,
            numColors : 2,
            expected : [false,true,false,true,false,true]
          }
        };
        var result;
        for (var i=1, max=Object.keys(tests).length; i<=max; i++) {
          result = [];
          M = Tests.hasWon.M;
          numPlayers = tests[i].numPlayers;
          numColors = tests[i].numColors;
          Colors = { // attribution des couleurs à chaque joueur
            2: {
              1: [[1],[2]],
              2: [[1,3],[2,4]],
              3: [[1,3,5],[2,4,6]]
            },
            3: { 2: [[1,3],[4,5],[2,6]] },
            4: { 1: [[1],[2],[3],[4]] },
            6: { 1: [[1],[3],[6],[2],[4],[5]] }
          }[numPlayers][numColors];
          isOver = initArray(numPlayers, numColors, false);
          for (var player=0; player<numPlayers; player++) {
            Player = player;
            for (var j=0; j<Colors[Player].length; j++) {
              result.push(hasWon(Colors[Player][j]));
            }
          }
          if (JSON.stringify(result) == JSON.stringify(tests[i].expected)) {
            console.log('test ' + i + ': SUCCESS');
          }
          else {
            console.log('test ' + i + ': FAIL');
            console.log('result is ', result, ', should be ', tests[i].expected);
          }
        }
      }

    },

    move : {
      /*// ***** ENVIRONNEMENT *****
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
      move(testVars.mov_list);
      if (M !== testVars.M) console.log('ERROR: move(' + testVars.mov_list + ') is ' + M + ', should be ' + testVars.M);*/
    },

    restart : {

      runTest : function() {
        var test = {
          M : [
            [false, false, false, false, false, false, false, false, false, false, false, false, 1, false, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, 1, false, 1, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, 1, false, 1, false, 1, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, 1, false, 1, false, 1, false, 1, false, false, false, false, false, false, false, false, false],
            [3, false, 3, false, 3, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, 5, false, 5, false, 5],
            [false, 3, false, 3, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, 5, false, 5, false],
            [false, false, 3, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, 5, false, false],
            [false, false, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, false, false],
            [false, false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false, false],
            [false, false, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, false, false],
            [false, false, 6, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, 4, false, false],
            [false, 6, false, 6, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, 4, false, 4, false],
            [6, false, 6, false, 6, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, 4, false, 4, false, 4],
            [false, false, false, false, false, false, false, false, false, 2, false, 2, false, 2, false, 2, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, 2, false, 2, false, 2, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, 2, false, 2, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, false, 2, false, false, false, false, false, false, false, false, false, false, false, false]
          ],
          ID : '?', // comment tester ?
          Player : 0,
          IsOver : false,
          Start_Cell : (0,0),
          isOver : [[false],[false]],
          players : '?' // comment tester ?
        }
        numPlayers = 2;
        numColors = 1;
        M = ID = Player = IsOver = Start_Cell = isOver = null;
        restart();
        var errors = false;
        if (JSON.stringify(M) !== JSON.stringify(test.M)) {
          console.log('M is ', M, ', should be ', test.M);
          errors = true;
        }
        if (Player !== test.Player) {
          console.log('Player is ', Player, ', should be ', test.Player);
          errors = true;
        }
        if (IsOver !== test.IsOver) {
          console.log('IsOver is ', IsOver, ', should be ', test.IsOver);
          errors = true;
        }
        if (JSON.stringify(Start_Cell) !== JSON.stringify(test.Start_Cell)) {
          console.log('Start_Cell is ', Start_Cell, ', should be ', test.Start_Cell);
          errors = true;
        }
        if (JSON.stringify(isOver) !== JSON.stringify(test.isOver)) {
          console.log('isOver is ', isOver, ', should be ', test.isOver);
          errors = true;
        }
        if (errors) console.log('test restart : FAIL');
        else console.log('test restart : SUCCESS');
      }

    },

    createCell : {

      // runTest : function() {
      //   var tests = {
      //     1: {
      //       name : 'createCell(2,10,3)',
      //       result : createCell(2,10,3),
      //       expected : ?
      //     }
      //   }
      //   for (var i=1, max=Object.keys(tests).length; i<=max; i++) {
      //     if (tests[i].result === tests[i].expected) console.log('test ' + tests[i].name + ': SUCCESS');
      //     else {
      //       console.log('test ' + tests[i].name + ': FAIL');
      //       console.log('result is ', tests[i].result, ', should be ', tests[i].expected);
      //     }
      //   }
      // }

    },

    createBoard : {

      runTest : function() {

        var tests = {
          1: {
            name : 'plateau de base',
            matrice : [
              [false, false, false, false, false, false, false, false, false, false, false, false, 1, false, false, false, false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false, false, false, 1, false, 1, false, false, false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false, false, 1, false, 1, false, 1, false, false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false, 1, false, 1, false, 1, false, 1, false, false, false, false, false, false, false, false, false],
              [3, false, 3, false, 3, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, 5, false, 5, false, 5],
              [false, 3, false, 3, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, 5, false, 5, false],
              [false, false, 3, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, 5, false, false],
              [false, false, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, false, false],
              [false, false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false, false],
              [false, false, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, false, false],
              [false, false, 6, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, 4, false, false],
              [false, 6, false, 6, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, 4, false, 4, false],
              [6, false, 6, false, 6, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, 4, false, 4, false, 4],
              [false, false, false, false, false, false, false, false, false, 2, false, 2, false, 2, false, 2, false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false, false, 2, false, 2, false, 2, false, false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false, false, false, 2, false, 2, false, false, false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false, false, false, false, 2, false, false, false, false, false, false, false, false, false, false, false, false]
            ],
            result : []
          },
          2 : {
            name : 'aucune case',
            matrice : initArray(17,25,false),
            result : []
          },
          3 : {
            name : 'toutes les cases vides',
            matrice : initArray(17,25,-1),
            result : []
          }
        };

        for (var i=1, max=Object.keys(tests).length; i<=max; i++) {
          if (i == 1) {
            console.log("test '" + tests[i].name + "' en cours." );
            console.log("Prochain test dans 5s.");
            tests[i].result = createBoard(tests[i].matrice);
          }
          else {
            setTimeout(function(tests,n){
              for (var i=0; i<17; i++) { // supprime le résultat du test précédent
                for (var j=0; j<25; j++) {
                  if (tests[n-1].result[i][j]) {
                    tests[n-1].result[i][j].parentNode.parentNode.removeChild(tests[n-1].result[i][j].parentNode);
                  }
                }
              }
              console.log("test '" + tests[n].name + "' en cours.");
              if (n<3) console.log("Prochain test dans 5s.");
              tests[n].result = createBoard(tests[n].matrice);
            }, 5000*(i-1), tests, i);
          }
        }
      }

    },

    initGameBoard : {

      runTest : function() {
        var test = {
          name : "initGameBoard()",
          result : initGameBoard(),
          expected : [
            [false, false, false, false, false, false, false, false, false, false, false, false, 1, false, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, 1, false, 1, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, 1, false, 1, false, 1, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, 1, false, 1, false, 1, false, 1, false, false, false, false, false, false, false, false, false],
            [3, false, 3, false, 3, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, 5, false, 5, false, 5],
            [false, 3, false, 3, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, 5, false, 5, false],
            [false, false, 3, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, 5, false, false],
            [false, false, false, 3, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 5, false, false, false],
            [false, false, false, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, false, false, false],
            [false, false, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, false, false],
            [false, false, 6, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, 4, false, false],
            [false, 6, false, 6, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, 4, false, 4, false],
            [6, false, 6, false, 6, false, 6, false, -1, false, -1, false, -1, false, -1, false, -1, false, 4, false, 4, false, 4, false, 4],
            [false, false, false, false, false, false, false, false, false, 2, false, 2, false, 2, false, 2, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, 2, false, 2, false, 2, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, 2, false, 2, false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false, false, 2, false, false, false, false, false, false, false, false, false, false, false, false]
          ]
        };

        if (JSON.stringify(test.result) == JSON.stringify(test.expected)) console.log('test ' + test.name + ': SUCCESS');
        else {
          console.log('test ' + test.name + ': FAIL');
          console.log('result is ', test.result, ', should be ', test.expected);
        }
      }

    },

    initArray : {

      runTest : function() {
        var tests = {
          1: {
            name : "initArray(2,3,0)",
            result : initArray(2,3,0),
            expected : [[0,0,0],[0,0,0]]
          },
          2: {
            name : 'initArray(4,0,false)',
            result : initArray(4,0,false),
            expected : [false,false,false,false]
          },
          3: {
            name : 'initArray(2,3)',
            result : initArray(2,3),
            expected : [[undefined, undefined, undefined],[undefined, undefined, undefined]]
          },
          4: {
            name : 'initArray(0,3,0)',
            result : initArray(0,3,0),
            expected : []
          },
          5: {
            name : 'initArray(2)',
            result : initArray(2),
            expected : [undefined, undefined]
          }
        };

        for (var i=1, max=Object.keys(tests).length; i<=max; i++) {
          if (JSON.stringify(tests[i].result) === JSON.stringify(tests[i].expected)) console.log('test ' + tests[i].name + ': SUCCESS');
          else {
            console.log('test ' + tests[i].name + ': FAIL');
            console.log('result is ', tests[i].result, ', should be ', tests[i].expected);
          }
        }
      }

    },

    isOnGameBoard : {
      runTest : function() {
        var tests = {
          1 : {
            x : 2,
            y : 12,
            expected : true
          },
          2 : {
            x : 10,
            y : -1,
            expected : false
          }
        }
        var result;
        for (var i=1, max=Object.keys(tests).length; i<=max; i++) {
          result = isOnGameBoard(tests[i].x, tests[i].y);
          if (result === tests[i].expected) {
            console.log('test ' + i + ': SUCCESS');
          }
          else {
            console.log('test ' + i + ': FAIL');
            console.log('contains(',tests[i].x, ',', tests[i].x, ') is ', result, ', should be ', tests[i].expected);
          }
        }
      }
    },

    contains : {

      runTest : function() {
        var tests = {
          1 : {
            liste : [1,2,3],
            objet : 2,
            expected : true
          },
          2 : {
            liste : ['1','2','3'],
            objet : 2,
            expected : false
          },
          3 : {
            liste : [[2,3],[1,5],[1,2]],
            objet : [1,2],
            expected : true
          },
          4 : {
            liste :  [[2,3],[3,5],[4,2]],
            objet : [1,2],
            expected : false
          }
        }
        var result;
        for (var i=1, max=Object.keys(tests).length; i<=max; i++) {
          result = contains(tests[i].liste, tests[i].objet);
          if ( result === tests[i].expected) {
            console.log('test ' + i + ': SUCCESS');
          }
          else {
            console.log('test ' + i + ': FAIL');
            console.log('contains(',tests[i].liste, ',', tests[i].objet, ') is ', result, ', should be ', tests[i].expected);
          }
        }
      }

    },

    game : {

      clicks : { // coordonnées des cases à cliquer
        2: { // nombre de joueurs
          1: // nombre de couleurs
            [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11]],
          2: [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11],[4,4],[6,6],[10,22],[10,18],[4,0],[8,16],[12,24],[12,8],[6,4],[6,8],[11,19],[7,7],[4,2],[6,4],[11,23],[9,13],[5,3],[9,15],[11,21],[11,17],[6,6],[12,24],[12,18],[10,8],[6,2],[10,14],[9,21],[5,9],[6,4],[6,16],[9,13],[9,9],[5,1],[9,21],[10,8],[6,4],[9,15],[11,21],[12,8],[6,2],[4,6],[12,18],[10,20],[4,6],[10,14],[10,22],[5,9],[5,1],[6,16],[10,20],[12,20],[12,16],[7,3],[7,5],[10,18],[10,6],[7,5],[9,15],[12,16],[8,4],[4,10],[12,10],[12,22],[4,2],[8,16],[8,20],[5,1],[4,0],[5,5],[9,17],[7,7],[5,1],[6,14],[6,16],[10,6],[6,6],[4,14],[10,8],[9,9],[5,5],[9,15],[9,19],[11,17],[11,15],[9,21],[11,23],[11,15],[7,3],[9,17],[11,19],[6,6],[4,4],[6,8],[7,9],[6,2],[5,3],[7,9],[13,15],[8,4],[6,2],[5,11],[13,11]]
        }
      },

      runTest : function() {
        // ***** ENVIRONNEMENT *****
        restart();
        // ***** TESTS *****
        var clicks = Tests.game.clicks[numPlayers][numColors];
        for (var i=0, max = clicks.length; i<max; i++) {
          setTimeout(Tests.sim.simulate,100*i,ID[clicks[i][0]][clicks[i][1]], "click");
        };
      }

    },

    sim : {
      // simulate mouse click (https://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript)
      simulate: function (element, eventName) {
          var options = Tests.sim.extend(Tests.sim.defaultOptions, arguments[2] || {});
          var oEvent, eventType = null;
          for (var name in Tests.sim.eventMatchers) {
              if (Tests.sim.eventMatchers[name].test(eventName)) { eventType = name; break; }
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
              oEvent = Tests.sim.extend(evt, options);
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

    },

    Assert : {

      arraysEqual : function (a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
        for (var i = 0; i < a.length; i++) {
            if (((typeof(a[i]) == "object" && a[i].length > 0) || (typeof(b[i]) == "object" && b[i].length > 0)) && (!Tests.Assert.arraysEqual(a[i],b[i]))) return false;
            else if (a[i] !== b[i]) return false;
        }
        return true;
      }

    }
};
