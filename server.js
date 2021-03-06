/** Les fonctions serveur */
var Server = require('./server.functions.js');

/** Le framework Express */
var express = require('express');
/** L'instance d'Express */
var app = express();
/** Le module http */
var http = require('http');
/** Le serveur HTTP */
var server = http.Server(app);
/** L'instance de socket.io liée au serveur */
var io = require('socket.io')(server);

/** Le port utilisé par le serveur */
var PORT = (process.env.PORT || 8000);
server.listen(PORT); // on écoute sur le port

/** Le module mysql */
var mysql = require('mysql');
/** La configuration de la base de données */
var dbConfig = (process.env.NODE_ENV === 'production') ? { // distante
  host     : 'us-cdbr-iron-east-05.cleardb.net',
  user     : 'bb4e923f5faaa9',
  password : '382b4542',
  database : 'heroku_703605cd7a769b9',
  dateStrings: 'date'
} : { // locale
  host: 'localhost',
  user: 'hophophop',
  password: 'hophophop',
  database : 'dames_chinoises',
  dateStrings: 'date'
};
/** La connexion à la base de données */
var connection;
handleDisconnect(); // on invoque la fonction de reconnexion

/** Le module body-parser */
var bodyParser = require("body-parser");
// configure express pour utiliser body-parser comme intermédiaire
app.use(bodyParser.urlencoded({ extended: false })); // on configure body-parser (voir site pug)
app.use(bodyParser.json());
app.set('views', './views'); // dossier pour les templates html
app.set('view engine', 'pug'); // moteur d'affichage des templates

app.use(express.static(__dirname)); // pour pouvoir utiliser les fichiers statiques

// On configure les routes du serveur HTTP
app.post('/game', function(request, response) { // en cas de requête POST sur la page de jeu
  if (typeof(request.body.inputNewGameForm) !== 'undefined' && typeof(request.body.inputJoinGameForm) !== 'undefined') { // on redirige si aucune variable n'est transmise par formulaire
    response.redirect('/');
  }
  else if (typeof(request.body.inputNewGameForm) !== 'undefined') { // sinon si c'est le foormulaire de création de partie qui est rempli on récupère les données du formulaire
    var numColors = Server.escapeHtml(request.body.numColors);
    var numPlayers = Server.escapeHtml(request.body.numPlayers);
    var player1 = (typeof(request.body.player1) !== 'undefined' && request.body.player1 !== '')? Server.escapeHtml(request.body.player1) : "Joueur 1";
    var player2 = (typeof(request.body.player2) !== 'undefined' && request.body.player2 !== '')? Server.escapeHtml(request.body.player2) : "Joueur 2";
    var player3 = (typeof(request.body.player3) !== 'undefined' && request.body.player3 !== '')? Server.escapeHtml(request.body.player3) : "Joueur 3";
    var player4 = (typeof(request.body.player4) !== 'undefined' && request.body.player4 !== '')? Server.escapeHtml(request.body.player4) : "Joueur 4";
    var player5 = (typeof(request.body.player5) !== 'undefined' && request.body.player5 !== '')? Server.escapeHtml(request.body.player5) : "Joueur 5";
    var player6 = (typeof(request.body.player6) !== 'undefined' && request.body.player6 !== '')? Server.escapeHtml(request.body.player6) : "Joueur 6";
    var ordi1 = Server.escapeHtml(request.body.ordi1);
    var ordi2 = Server.escapeHtml(request.body.ordi2);
    var ordi3 = Server.escapeHtml(request.body.ordi3);
    var ordi4 = Server.escapeHtml(request.body.ordi4);
    var ordi5 = Server.escapeHtml(request.body.ordi5);
    var ordi6 = Server.escapeHtml(request.body.ordi6);
    var level = Server.escapeHtml(request.body.level);
    // on effectue les tests sur les données du formulaire
    var players = [player1,player2,player3,player4,player5,player6];
    var userRegex = new RegExp("^[a-zA-Z0-9_-]{2,10}$");
    var defaultRegex = new RegExp("^Joueur [1-6]$");
    var namesFormatCheck = true;
    var namesDuplicatesCheck = true;
    for (var i=0; i<numPlayers-1; i++) {
      if (! (userRegex.test(players[i]) || defaultRegex.test(players[i]))) namesFormatCheck = false;
      for (var j=0; j<numPlayers-1; j++) {
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
      // on crée une salle unique avec Socket.IO
      var gameId = ( Math.random() * 100000 ) | 0;
      response.render('game', { // on affiche le template avec les bonnes valeurs
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
        level: level,
        role: "host",
        gameId: gameId
      });
    }
  }
  else if (typeof(request.body.inputJoinGameForm) !== 'undefined') { // si le formulaire pour rejoindre une partie à été rempli on récupère les valeurs et on effectue les tests sur ces dernières
    var gameId = Server.escapeHtml(request.body.roomID);
    var player = Server.escapeHtml(request.body.player);
    var gameIdRegex = new RegExp("[0-9]{1-6}");
    var nameRegex = new RegExp("^[a-zA-Z0-9_-]{2,10}$");
    if (gameIdRegex.test(gameId) || gameId < 0 || gameId > 100000) {
      response.send("<p>N° de partie incorrect</p>");
    }
    else if (!nameRegex.test(player) && player !== '') {
      response.send("<p>Nom incorrect</p>");
    }
    else {
      if (!Server.contains(Object.keys(games), gameId)) {
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
    response.send("<p>Vous devez remplir un des deux formulaires</p>");
  }
});

app.get('/score',function(request,response){ // en cas de requête GET sur la page de scores
  if (Object.keys(request.query).length === 0 && request.query.constructor === Object) { // on redirige si aucune variable n'est transmise
    response.redirect('/');
  }
  else { // sinon on récupère les valeurs
    var name = request.query.name;
    var score = parseInt(request.query.score);
    var adversaire1 = request.query.adversaire1;
    var adversaire2 = request.query.adversaire2;
    var adversaire3 = request.query.adversaire3;
    var adversaire4 = request.query.adversaire4;
    var adversaire5 = request.query.adversaire5;
    var sql = "INSERT INTO parties (nom, score, adversaire1, adversaire2, adversaire3, adversaire4, adversaire5, dategame) VALUES ('" + name + "', " + score + ", '" + adversaire1 + "', '" + adversaire2 + "', '" + adversaire3 + "', '" + adversaire4 + "', '" + adversaire5 +  "', now())";
    connection.query(sql, function(error, rows, fields) { // et on les met dans la base de données
      if (error) throw error;
    });
    response.sendStatus(200); // on ferme la requête
  }
});

app.get('/', function(request, response) { // en cas de requête GET surla page d'accueil
  connection.query('SELECT nom, score, dategame FROM parties ORDER BY score ASC LIMIT 0, 10', function(error, rows, fields) { // on récupère les meilleurs scores dans la BDD
    if (error) throw error;
    response.render('home', { // on les affiche sur la page d'accueil
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

app.get('/game', function (request, response) { // en cas de requête GET surla page de jeu
  response.redirect('/'); // on redirige vers la page d'accueil
});

/**
 * Les données des différentes parties en cours
 * @type {Object.<Object>}
 * @property {Object} undefined - Une partie identifiée par son numéro
 * @property {Int} undefined.numPlayers - Le nombre de joueurs
 * @property {Int} undefined.numColors - Le nombre de couleurs par joueur
 * @property {Int[][]} undefined.COLORS - La liste contenant la liste des couleurs pour chaque joueur
 * @property {String[]|Object[]} undefined.PLAYERS - La liste des joueurs
 * @property {String} undefined.PLAYERS[].name - Le nom du joueur
 * @property {Int} undefined.PLAYERS[].score - Le score du joueur
 * @property {Int[]} undefined.PLAYERS[].colors - Les couleurs du joueur
 * @property {Int} undefined.PLAYERS[].number - Le numéro du joueur (de 1 à 6)
 * @property {Boolean[]} undefined.isPlayedByIa - La liste des joueurs joués par l'IA. L'index correspond au numéro du joueur -1, la valeur vaut true si c'est l'IA qui joue, false sinon
 * @property {Int} undefined.numHumanPlayers - Le nombre de joueurs qui ne sont pas contrôlés par l'IA
 * @property {Int} undefined.remaining - Le nombre de joueurs qui n'ont pas encore rejoint la partie
 * @property {Boolean} undefined.isIaPlaying - true si l'IA est en train de jouer, false sinon
 * @property {Int} undefined.restartCount - Le nombre de joueurs qui veulent recommencer une partie
 * @property {Int} undefined.Time - Le temps à attendre entre deux IA qui jouent
 * @property {Array[]} undefined.gameBoard - La matrice représentant le plateau de jeu
 * @property {Int|Boolean} undefined.gameBoard[x][y]] - La couleur du pion sur la case de coordonnées (x,y) : 1/vert, 2/orange, 3/bleu foncé, 4/bleu clair, 5/jaune, 6/rouge, -1/case inoccupée, false/case inutilisable
 * @property {Int} undefined.player - Le numéro du joueur dont c'est le tour -1
 * @property {Int[]|Int} undefined.startCell - Les coordonnées de la case de départ, ou 0 si aucune case n'est sélectionnée
 * @property {Boolean} undefined.gameOver - true si la partie est finie, false sinon
 * @property {Array[]} undefined.gameState - La liste des états d'avancement de chaque joueur
 * @property {Boolean[]} undefined.gameState[] - true si cette couleur est dans son triangle d'arrivée, false sinon (dans le même ordre que PLAYERS[].colors)
 * @property {Int[][][]} undefined.history - Les coordonnées des derniers déplacements. L'index correspond au numéro du joueur -1.
 */
var games = {};

/**
 * Les données des différents utilisateurs actuellement connectés
 * @type {Object.<Object>}
 * @property {Object} undefined - L'id de la WebSocket utilisée par le client
 * @property {Int} undefined.gameId - Le numéro de la partie à laquelle participe le client
 * @property {Int} undefined.number - Le numéro du joueur joué par le client
 * @property {String} undefined.name - Le nom du client
 */
var clients = {};

io.on('connection', function (socket) { // déclaration des fonctions de callback
  socket.on('create game', function (data) { // en cas de message 'create game' reçu
    console.log("create game : ", data);
    var numHumanPlayers = 0;
    for (var i=0, max=data["isPlayedByIa"].length; i<max; i++){ // compte le nombre de joueurs non-IA
      if (!data["isPlayedByIa"][i]) numHumanPlayers++;
    }
    games[data["gameId"]] = { // crée les données de la partie
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
    socket.join(data["gameId"].toString()); // rejoint la partie et attend les autres joueurs
    clients[this.id] = { // crée les données de l'utilisateur
      gameId: data["gameId"],
      number: 0,
      name: data["player"]
    };
    if (games[data["gameId"]]["numHumanPlayers"] === 0 || games[data["gameId"]]["PLAYERS"].length + 1 === games[data["gameId"]]["numHumanPlayers"]) { // si la partie est complète
      var PLAYERS = games[data["gameId"]]["PLAYERS"];
      for (i=2; i<=games[data["gameId"]]["numPlayers"]; i++) {
        if (!games[data["gameId"]]["isPlayedByIa"][i-1]) {
          // games[data["gameId"]]["player"+i] = (typeof(PLAYERS[0]) !== 'undefined' && PLAYERS[0] !== '')? PLAYERS.shift() : "Joueur " + i;
        }
        else { // si joué par l'IA
          games[data["gameId"]]["player"+i] = "Ordinateur";
        }
      }
      delete games[data["gameId"]]["PLAYERS"]; // supprime l'array PLAYERS
      Server.init(games, data["gameId"]); // initialise la partie
      /**
      * @event game full
      * @description Avertit le client que la partie peut commencer. Transmet le numéro de la partie.
      * @type {Int}
      */
      io.sockets.in(data["gameId"]).emit('game full', games[data["gameId"]]);
      if (numHumanPlayers === 0) { // si uniquement des IA
        Server.play(io, clients, games, data["gameId"]) // fait jouer la 1ère IA
      }
    }
  });
  socket.on('join game', function (data) { // en cas de message 'join game' reçu
    console.log('join game : ', data);
    if (data["player"] !== '' && Server.contains(games[data["gameId"]]["PLAYERS"], data["player"]) || data["player"] === (games[data["gameId"]]["player1"])) { // si le nom est déjà pris
      /**
       * Demande un nouveau nom au client
       * @event name error
       * @type {Object}
       * @property name - Le nom demandé par le joueur
       */
      socket.emit('name error', { name: data["player"] });
      return;
    }
    socket.join(data["gameId"].toString()); // rejoint la partie
    games[data["gameId"]]['remaining'] -= 1; // nombre de places libres
    games[data["gameId"]]["PLAYERS"].push(data["player"]); // ajoute le joueur à la liste
    var n = games[data["gameId"]]["PLAYERS"].length;
    clients[this.id] = { // crée les données de l'utilisateur
      gameId: data["gameId"],
      number: n,
      name: data["player"]
    };
    games[data["gameId"]]["player"+(n+1)] = (data["player"] !== '')? data["player"] : "Joueur" + (n+1); // détermine le nom du joueur
    if (games[data["gameId"]]["PLAYERS"].length + 1 === games[data["gameId"]]["numHumanPlayers"]) { // si la partie est complète
      var PLAYERS = games[data["gameId"]]["PLAYERS"];
      for (i=2; i<=games[data["gameId"]]["numPlayers"]; i++) {
        if (!games[data["gameId"]]["isPlayedByIa"][i-1]) {
          // games[data["gameId"]]["player"+i] = (typeof(PLAYERS[0]) !== 'undefined' && PLAYERS[0] !== '')? PLAYERS.shift() : "Joueur " + i;
        }
        else { // attribue les noms des IA
          games[data["gameId"]]["player"+i] = "Ordinateur";
        }
      }
      delete games[data["gameId"]]["PLAYERS"]; // supprime l'array PLAYERS
      Server.init(games, data["gameId"]); // initialise la partie
      /** @see event:game full */
      io.sockets.in(data["gameId"]).emit('game full', games[data["gameId"]]); // avertit les joueurs que la partie peut commencer
    }
  });
  socket.on('move request', function (data) { // en cas de message 'move request' reçu
    console.log('move request : ', data);
    Server.play(io, clients, games, clients[this.id]["gameId"], this, data["cell"]);
  }); // joue le coup demandé
  socket.on('disconnecting', function (reason) { // en cas de message 'disconnecting' reçu
    if (Server.contains(Object.keys(clients), this.id)) { // si l'utilisateur est enregistré
    /**
     * Avertit un client qu'un joueur a été déconnecté. Transmet l'objet représentant le joueur dans [clients]{@link clients}
     * @event player disconnecting
     * @type {Object}
     */
      io.sockets.in(clients[this.id]["gameId"]).emit('player disconnecting', clients[this.id]);
      if (!games[clients[this.id]["gameId"]]["gameOver"]) { // si la partie n'est pas finie
        games[clients[this.id]["gameId"]]["gameOver"] = true; // la termine
        /** @see event:end game */
        io.sockets.in(clients[this.id]["gameId"]).emit('end game', {});
      }
    }
  });
  socket.on('disconnect', function (reason) { // en cas de message 'disconnect' reçu
    if (Server.contains(Object.keys(clients), this.id) && !Server.contains(Object.keys(io.sockets.adapter.rooms), clients[this.id]["gameId"].toString())) { // s'il n'y a plus aucun joueur dans la partie
      console.log('deleting game ', clients[this.id]["gameId"]);
      delete games[clients[this.id]["gameId"]]; // supprime la partie
    }
  });
  socket.on('restart request', function () { // en cas de message 'restart request'
    games[clients[this.id]["gameId"]]["restartCount"] += 1; // compte le nombre de requêtes
    if (games[clients[this.id]["gameId"]]["restartCount"] === games[clients[this.id]["gameId"]]["numHumanPlayers"]) { // si tous les joueurs veulent recommencer
      Server.restart(games, clients[this.id]["gameId"], 1); // redémarre la partie (à revoir, plus d'option 1 pour restart ?)
      console.log('restarting : ', clients[this.id]["gameId"]);
      /**
       * Avertit un client du début de la nouvelle partie
       * @event restart game
       */
      io.sockets.in(clients[this.id]["gameId"]).emit('restart game', {});
    }
  });
});

/**
 * fonction pour se reconnecter à la BDD en cas de déconnexion
 * @see https://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection
 */
function handleDisconnect() {
  connection = mysql.createConnection(dbConfig); // Recreate the connection, since the old one cannot be reused.

  connection.connect(function(error) { // The server is either down or restarting (takes a while sometimes).
    if(error) {
      console.log('error when connecting to db:', error);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect, to avoid a hot loop, and to allow our node script to process asynchronous requests in the meantime. If you're also serving http, display a 503 error.
    }
  });

  connection.on('error', function(error) {
    console.log('db error', error);
    if(error.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually lost due to either server restart, or a connnection idle timeout (the wait_timeout server variable configures this)
      handleDisconnect();
    } else {
      throw error;
    }
  });
}
