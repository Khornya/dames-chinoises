var share = require('./utils.js');
share.someSharedMethod();

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'pug');

app.post('/game',function(request,response){
  // ajouter vérification formulaires
  if (typeof(request.body.inputform1) !== 'undefined') {
    var numColors = request.body.colors;
    var numPlayers = request.body.nombre_joueurs;
    var player1 = (typeof(request.body.player1) !== 'undefined' && request.body.player1 !== '')? request.body.player1 : "Joueur 1";
    var player2 = (typeof(request.body.player2) !== 'undefined' && request.body.player2 !== '')? request.body.player2 : "Joueur 2";
    var player3 = (typeof(request.body.player3) !== 'undefined' && request.body.player3 !== '')? request.body.player3 : "Joueur 3";
    var player4 = (typeof(request.body.player4) !== 'undefined' && request.body.player4 !== '')? request.body.player4 : "Joueur 4";
    var player5 = (typeof(request.body.player5) !== 'undefined' && request.body.player5 !== '')? request.body.player5 : "Joueur 5";
    var player6 = (typeof(request.body.player6) !== 'undefined' && request.body.player6 !== '')? request.body.player6 : "Joueur 6";
    var ordi1 = request.body.ordi1;
    var ordi2 = request.body.ordi2;
    var ordi3 = request.body.ordi3;
    var ordi4 = request.body.ordi4;
    var ordi5 = request.body.ordi5;
    var ordi6 = request.body.ordi6;
    // Create a unique Socket.IO Room
    var gameId = ( Math.random() * 100000 ) | 0;
    response.render('game', {
      nombre_joueurs: numPlayers,
      colors: numColors,
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
  else if (typeof(request.body.inputform2) !== 'undefined') {
    var gameId = request.body.roomID;
    var player = request.body.player;
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
    connection.query(sql, function(err, rows, fields) {
      if (err) throw err;
    });
    response.sendStatus(200);
  }
});

var mysql = require('mysql');
var db_config = {
  host     : 'us-cdbr-iron-east-05.cleardb.net',
  user     : 'bb4e923f5faaa9',
  password : '382b4542',
  database : 'heroku_703605cd7a769b9',
  dateStrings: 'date'
};

var connection;

function handleDisconnect() { // https://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

var PORT = (process.env.PORT || 8000);

server.listen(PORT);

app.get('/', function(req, res) {
  connection.query('SELECT nom, score, dategame FROM parties ORDER BY score ASC LIMIT 0, 10', function(err, rows, fields) {
    if (err) throw err;
    res.render('index', {
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

app.get('/game', function (req, res) {
  res.redirect('/');
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
      remaining: numHumanPlayers-1
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
      init(data["gameId"],0);
      io.sockets.in(data["gameId"]).emit('game full', games[data["gameId"]]);
    }
  });
  socket.on('join game', function (data) {
    console.log('join game : ', data);
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
      init(data["gameId"], 0);
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
      games[clients[this.id]["gameId"]]["gameOver"] = true;
      io.sockets.in(clients[this.id]["gameId"]).emit('end game', { winner: 0 });
    }
  });
  socket.on('disconnect', function (reason) {
    if (contains(Object.keys(clients), this.id) && !contains(Object.keys(io.sockets.adapter.rooms), clients[this.id]["gameId"].toString())) {
      console.log('deleting game ', clients[this.id]["gameId"]);
      delete games[clients[this.id]["gameId"]];
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
      matrice[R][24-C] = 5;;
      matrice[16-R][C] = 6;
    }
  }
  for (var C=4; C<21; C+=2) { matrice[8][C] = -1 }
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
  restart(gameId,0);
}


function restart(gameId, opt=1) {
  if (opt) {
    games[gameId]["gameBoard"] = initGameBoard();
    for(var n=0; n < games[gameId]["numPlayers"]; n++)
      games[gameId]["PLAYERS"][n].score = 0;
  }
  games[gameId]["player"]=0;
  games[gameId]["startCell"] =  (0,0) ;
  games[gameId]["gameOver"] = false;
  games[gameId]["gameState"] = initArray(games[gameId]["numPlayers"], games[gameId]["numColors"], false);
  games[gameId]["history"] = initArray(games[gameId]["numPlayers"], 0, false);
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


function sameTraject(gameId, traject) { // utile ? myArray.reverse()
  var i, j;
  i = traject.length;
  j = i-1;
  last = games[gameId]["history"][games[gameId]["player"]];
  if (i !== last.length) return false;
  while (i--) {
    if (traject[j-i][0] !== last[i][0] ||
       traject[j-i][1] !== last[i][1])
       return false;
   }
   return true;
}

function getPath(gameId, startCell, endCell) {
  games[gameId]["reachableCells"] = [];                                  // init reachableCells
  var R = startCell[0];
  var C = startCell[1];
  var i, j;
  for (i =R-1; i <= R+1; i++)  {               // add mouvement adjaçant
    for (j=C-2; j<= C+2; j++) {
       if ((i!=R || j!=C) && isOnGameBoard([i,j]) && games[gameId]["gameBoard"][i][j]== -1){
         if(! isMovingBackward(games[gameId]["playedColor"], [R,C], [i,j]) &&
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
  var pivot_r , pivot_c;
  var n, index;
  var access_cell = []
  var R = cells[0][0]; var C = cells[0][1];

  // chercher saut sur ligne + diagonal 6 directions :
  for (i=-1; i<2; i++) {     // i in [-1, 0, 1]
    for (j=-1; j<2; j+=2) {  // j in [-1, 1]
      pivot_r = R+i;
      pivot_c = C+j;
      while (isOnGameBoard([pivot_r, pivot_c]) && games[gameId]["gameBoard"][pivot_r][pivot_c] < 1) { // avancer jusqu'a case occupée
        pivot_r += i;
        pivot_c += j;
      }
      n=0;
      for (k=1; k< j*(pivot_c-C); k+=1) {
        if (!isOnGameBoard([pivot_r+i*k, pivot_c+j*k])) break;
        if (games[gameId]["gameBoard"][pivot_r+i*k][pivot_c+j*k] > 0) n+=1; // si un autre pion sur le chemin break
      }
      if (n===0) {
        index_r = 2*pivot_r-R;   //(quand i=0; , pivot_r=R ; 2*R-R=R (on reste sur la même la ligne)
        index_c = 2*pivot_c-C;
        if (contains(oldPath,[index_r, index_c])) continue ; // éviter de tourner rond
        if (isOnGameBoard([index_r, index_c]) && games[gameId]["gameBoard"][index_r][index_c] === -1) { // si la case en asymétrie est vide valide:
          if(! isMovingBackward(games[gameId]["playedColor"], [R,C], [index_r,index_c]) &&
               ! sameTraject(gameId, oldPath.concat([[R,C], [index_r, index_c]])))
            games[gameId]["reachableCells"].push([index_r, index_c])
          if (index_r==endCell[0] && index_c==endCell[1]) return oldPath.concat([[R,C], [index_r, index_c]]);
          else access_cell.push([index_r, index_c]);
        }
      }
    }
  }
  return (getJumps(gameId, cells.slice(1), endCell, oldPath) ||
          getJumps(gameId, access_cell, endCell, oldPath.concat([cells[0]])));
}


function hasWon(gameId, color) {
  var R, C;
  var n =  (color%2 ? color : color-2);
  for (var i=0; i<10; i++) {
    R = TRIANGLES_COORDS[n][i][0];
    C = TRIANGLES_COORDS[n][i][1]
    if (games[gameId]["gameBoard"][R][C] != color) return false ;
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
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
       if (this.readyState == 4) {
         if (this.status == 200) {
         }
         else {
          //  alert("Les scores n'ont pas pu être envoyés à la base de données");
         }
       }
    };
  var name = encodeURIComponent(games[gameId]["PLAYERS"][winner].name);
  var score = encodeURIComponent(games[gameId]["PLAYERS"][winner].score);
  var adversaires = games[gameId]["PLAYERS"].filter(item => item !== winner);
  adversaires.forEach(function(value, index, array) {
    array[index] = encodeURIComponent(value.name);
  })
  xhr.open('GET', '/score?name=' + name + '&score=' + score + '&adversaire1=' + adversaires[0] + '&adversaire2=' + adversaires[1] + '&adversaire3=' + adversaires[2] + '&adversaire4=' + adversaires[3] + '&adversaire5=' + adversaires[4]);
  xhr.send(null);
}

function makeBestMove(gameId) {
  if (!games[gameId]["isPlayedByIa"][games[gameId]["player"]]) return;
  if (games[gameId]["gameOver"]) return;       // Isover
  var i, j, k;             // var pour itération
  var weight=-99, selected; // meilleur poid et chemin depart arrivé correspondant
  var x, y, x0, y0, w=0, n;
  var a , b, p, p0;         // géomitrie
  var s=0;                  // pour avoir une idée sur le nombre d'itération
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
          a = (games[gameId]["playedColor"]%2 ? 1: -1) ;               // dans quelle direction vont les x? selon les couleur (1, 3, 5 direction +1, 2, 4, 6 direction -1
          b = (games[gameId]["playedColor"]%3 ? (games[gameId]["playedColor"]<3 ? 0 : -1) : 1); // dans quelle direction vont les y? selon les couleur (1, 2:aucun effet 3,6: +1 4, 5:-1
          p = -3*a*b;                            // ce code trouve l'equation de la droite allant de la pointe du home a la pointe de l'opposé
          p0 = -p*8-12;
          s+=1
          x = games[gameId]["reachableCells"][k][0];  y = games[gameId]["reachableCells"][k][1];  // (x, y) cellule accesible a partir de (i, j)
          w  = 10* (a*(x-i)+b*(y-j));                                // main direction, selon les option a, et b
          w += 10* (Math.pow((i-x0), 2) + Math.pow((j-y0), 2)/3);    // max distance from depart
          w -= 10* (Math.pow((x-x0), 2) + Math.pow((y-y0), 2)/3);    // min distance de la case accesible à la pointe (ds le meilleur cas val=0
          // le code suivant pour rester sur la ligne droite entre le home et l'oppossé
          w += 15* (Math.pow(p*i+j+p0, 2)/(Math.pow(p, 2)+3));    // privilégier le spions les plus éloignés
          w -= 15* (Math.pow(p*x+y+p0, 2)/(Math.pow(p, 2)+3));    // privilégier les positions les plus proches
          if (w > weight) {                                                      // compare
            weight =w;
            selected = [[i, j], x, y];
          }
        }
      }
    }
  }
  games[gameId]["playedColor"] = games[gameId]["gameBoard"][selected[0][0]][selected[0][1]];                                    // ici on valide le meilleur choix
  console.log(s + " scénario evaluated");
  games[gameId]["gameBoard"][selected[0][0]][selected[0][1]]=-1;
  traject = getPath(gameId, selected[0], [selected[1],selected[2]]);
  games[gameId]["history"][games[gameId]["player"]] = traject;
  games[gameId]["Time"] += 500*(traject.length)
  move(gameId, traject, games[gameId]["playedColor"]);
  setTimeout(function() { io.sockets.in(gameId).emit('move', { traject : traject, playedColor: games[gameId]["playedColor"] }); }, games[gameId]["Time"]);
  games[gameId]["PLAYERS"][games[gameId]["player"]].score += 1;
  if (hasWon(gameId, games[gameId]["playedColor"])) {
    games[gameId]["gameOver"] = true;
    io.sockets.in(gameId).emit('end game', { winner: games[gameId]["player"] });
    sendScore(gameId, games[gameId]["player"]);
    return true;
  }
  games[gameId]["player"] = (games[gameId]["player"]+1) % games[gameId]["numPlayers"];
  setTimeout(function() { io.sockets.in(gameId).emit('new turn', { player: games[gameId]["player"] }); }, games[gameId]["Time"]);

  games[gameId]["startCell"] = (0,0);
}

function validateMove(gameId, socket, cell) {
  var player = games[gameId]["player"];
  if (player !== clients[socket.id]["number"]) {
    socket.emit('game error', { message: 'wait for your turn', sound: "fail" });
    return;
  }
  var R = cell[0];
  var C = cell[1];
  var startCell = games[gameId]["startCell"];
  var COLORS = games[gameId]["COLORS"];
  var playedColor = games[gameId]["playedColor"];
  var gameBoard = games[gameId]["gameBoard"];
  var history = games[gameId]["history"];
  var Time = games[gameId]["Time"];
  var isPlayedByIa = games[gameId]["isPlayedByIa"];
  if (startCell === (0,0)) {                                     // premier click
    if (!(COLORS[player].includes(gameBoard[R][C]))) {                    // vérifie qu'on click sur le pion du joueur qui a la main
      if (!isPlayedByIa[player]) socket.emit('game error', { message: "please click on your own pieces", sound: "fail" });
      else socket.emit('game error', { message: "please wait until computer finish playing", sound: "fail" });
      return false;
    }
    games[gameId]["startCell"] = [R,C];
    socket.emit('select', { cell : [R,C] });
    games[gameId]["playedColor"] = gameBoard[R][C];
    games[gameId]["gameBoard"][R][C] = -1;
    return false;                                               // marquer la case depart vide pour ne pas l'utiliser comme pivot dans getJumps()
  }
  else {
    if (startCell[0] === R && startCell[1] === C) {            // retour à la case départ annule le mouvement
      games[gameId]["gameBoard"][R][C] = playedColor;
      games[gameId]["startCell"] = (0,0);
      socket.emit('deselect', { cell : [R,C], color: playedColor });
      return false;
    }
    if (gameBoard[R][C] !== -1) {                                        // cell not empty
      socket.emit('game error', { message: "Cell not empty!", sound: "fail" });
      return false;
    }
    if (isMovingBackward(playedColor, startCell, [R,C])) {    // mouvement illégal en réculant
      socket.emit('game error', { message: "You can't go back!", sound: "fail" });
      return false;
    }
    if (!(traject = getPath(gameId, startCell, [R,C]))) {            // mouvement invalide
      socket.emit('game error', { message: "Invalid move!", sound: "fail" });
      return false;
    }
    if (sameTraject(gameId, traject)) {
      socket.emit('game error', { message: "You can't replay the last move", sound: "fail" });
      return false;
    }
    games[gameId]["history"][player] = traject;
    games[gameId]["Time"] = 500*(traject.length-1);
    move(gameId, traject, games[gameId]["playedColor"]);
    io.sockets.in(gameId).emit('move', { traject : traject, playedColor: games[gameId]["playedColor"] });
    games[gameId]["PLAYERS"][player].score += 1;
    if (hasWon(gameId, playedColor)) {
      games[gameId]["gameOver"] = true;
      io.sockets.in(gameId).emit('end game', { winner: player });
      sendScore(gameId, player);
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
}
