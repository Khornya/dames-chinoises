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
  if (typeof(request.body.nombre_joueurs) !== 'undefined' && typeof(request.body.colors) !== 'undefined') {
    response.sendFile(__dirname + '/');
  }
  var colors = request.body.colors;
  var nombre_joueurs = request.body.nombre_joueurs;
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
  response.render('game', {
    nombre_joueurs: nombre_joueurs,
    colors: colors,
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
  })
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
    var date = new Date();
    console.log(Date.today);
    var datetime = date.getFullYear() + '-' +  (parseInt(date.getMonth()) + 1) + '-' + date.getDay();
    var sql = "INSERT INTO parties (nom, score, adversaire1, adversaire2, adversaire3, adversaire4, adversaire5, dategame) VALUES ('" + name + "', " + score + ", '" + adversaire1 + "', '" + adversaire2 + "', '" + adversaire3 + "', '" + adversaire4 + "', '" + adversaire5 +  "', '" + datetime + "')";
    connection.query(sql, function(err, rows, fields) {
      if (err) throw err;
    });
    response.sendStatus(200);
  }
});

var mysql = require('mysql');
var db_config = {
  host     : 'us-cdbr-iron-east-05.cleardb.net',
  user     : 'b2478404c9c4d9',
  password : 'ad4befae',
  database : 'heroku_d6e785e7b37be17'
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

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
