module.exports = {
  init,
  restart,
  isMovingBackward,
  sameTraject,
  getPath,
  getJumps,
  hasWon,
  isOnGameBoard,
  contains,
  sendScore,
  makeBestMove,
  validateMove,
  move,
  play,
  escapeHtml,
  TRIANGLES_COORDS
}

var Shared = require('./shared.js'); // appel du fichier pour récupérer les méthodes partagées

var http = require('http'); // requiert le module http

var TRIANGLES_COORDS = [
 [[0,12],[1,11],[1,13],[2,10],[2,12],[2,14],[3,9],[3,11],[3,13],[3,15]],
 [[16,12],[15,11],[15,13],[14,10],[14,12],[14,14],[13,9],[13,11],[13,13],[13,15]],
 [[4,0],[4,2],[4,4],[4,6],[5,1],[5,3],[5,5],[6,2],[6,4],[7,3]],
 [[12,24],[12,22],[12,20],[12,18],[11,23],[11,21],[11,19],[10,22],[10,20],[9,21]],
 [[4,24],[4,22],[4,20],[4,18],[5,23],[5,21],[5,19],[6,22],[6,20],[7,21]],
 [[12,0],[12,2],[12,4],[12,6],[11,1],[11,3],[11,5],[10,2],[10,4],[9,3]]
];

// fonction pour recommencer le jeu
function init(games, gameId) {
  // games[gameId]["gameBoard"] = initGameBoard(); // déjà dans restart
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
  restart(games, gameId);
}


function restart(games, gameId) {
  games[gameId]["gameBoard"] = Shared.initGameBoard();
  for (var n=0; n < games[gameId]["numPlayers"]; n++) {
    games[gameId]["PLAYERS"][n].score = 0;
  }
  games[gameId]["player"] = 0;
  games[gameId]["startCell"] =  0;
  games[gameId]["gameOver"] = false;
  games[gameId]["gameState"] = Shared.initArray(games[gameId]["numPlayers"], games[gameId]["numColors"], false);
  games[gameId]["history"] = Shared.initArray(games[gameId]["numPlayers"], 0, false);
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


function sameTraject(games, gameId, path) { // utile ? myArray.reverse()
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

function getPath(games, gameId, startCell, endCell) {
  games[gameId]["reachableCells"] = [];                        // init reachableCells
  games[gameId]["path"] = [];                                  // init list of path to get shortest one
  var row = startCell[0];
  var col = startCell[1];
  var i, j;
  for (i =row-1; i <= row+1; i++)  {               // add mouvement adjaçant
    for (j=col-2; j<= col+2; j++) {
       if ((i!=row || j!=col) && isOnGameBoard([i,j]) && games[gameId]["gameBoard"][i][j]== -1){
         if(! isMovingBackward(games[gameId]["playedColor"], [row,col], [i,j]) &&
               ! sameTraject(games, gameId, [startCell, [i,j]]))
            games[gameId]["reachableCells"].push([i,j]);                    // used by IA
         if (i==endCell[0] && j==endCell[1]) return ([startCell,[i,j]]);
       }
    }
  }
  getJumps(games, gameId, [startCell], endCell, []) ;
  if(games[gameId]["path"].length>0) {
    var path = games[gameId]["path"].reduce(function (a, b) { return a.length < b.length ? a : b; });
    return path;
  }
  else return false;
}



function getJumps(games, gameId, cells , endCell, oldPath) {
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
          if (oldPath[0] && ! (isMovingBackward(games[gameId]["playedColor"], oldPath[0], [index_r,index_c])))
            if (! sameTraject(games, gameId, oldPath.concat([[row,col], [index_r, index_c]])))
              games[gameId]["reachableCells"].push([index_r, index_c])
          if (index_r==endCell[0] && index_c==endCell[1]) {
            games[gameId]["path"].push(oldPath.concat([[row,col], [index_r, index_c]]));
          }
          else access_cell.push([index_r, index_c]);
        }
      }
    }
  }
  return (getJumps(games, gameId, cells.slice(1), endCell, oldPath) ||
          getJumps(games, gameId, access_cell, endCell, oldPath.concat([cells[0]])));
}


function hasWon(games, gameId, color) {
  var row, col;
  var n =  (color%2 ? color : color-2);
  for (var i=0; i<10; i++) {
    row = TRIANGLES_COORDS[n][i][0];
    col = TRIANGLES_COORDS[n][i][1];
    if (games[gameId]["gameBoard"][row][col] != color) return false;
  }
  for (n=0; n< games[gameId]["COLORS"][games[gameId]["player"]].length; n++) {
    if (games[gameId]["COLORS"][games[gameId]["player"]][n] === color)
      games[gameId]["gameState"][games[gameId]["player"]][n]=true;
  }
  return (! (games[gameId]["gameState"][games[gameId]["player"]].indexOf(false)>-1))
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


function sendScore(games, gameId, winner, callback) {
  var name = encodeURIComponent(winner.name);
  var score = encodeURIComponent(winner.score);
  var adversaires = games[gameId]["PLAYERS"].filter(item => item !== winner);
  adversaires.forEach(function(value, index, array) {
    array[index] = encodeURIComponent(value.name);
  })
  var request = http.get('http://hop-hop-hop.herokuapp.com/score?name=' + name + '&score=' + score + '&adversaire1=' + adversaires[0] + '&adversaire2=' + adversaires[1] + '&adversaire3=' + adversaires[2] + '&adversaire4=' + adversaires[3] + '&adversaire5=' + adversaires[4], function(response) {
   var data = ''; //This will store the page we're downloading.
   response.on('data', function(chunk) { //Executed whenever a chunk is received.
        data += chunk; //Append each chunk to the data variable.
   });
   response.on('end', function() {
      callback(null, data);
  });
 })
 request.on('error', function(error){
   callback(error);
 });
 request.end();
}

function makeBestMove(io, games, gameId) {
  if (!games[gameId]["isPlayedByIa"][games[gameId]["player"]]) return;
  if (games[gameId]["gameOver"]) return;       // Isover
  games[gameId]["isIaPlaying"] = true;
  var i, j, k, l;             // var pour itération
  var maxWeight=-99, selectedMove; // meilleur poid et chemin depart arrivé correspondant
  var x, y, x0, y0, weight=0, n;
  var xDirection , yDirection, axis, axis0;         // géométrie
  var count=0;                  // pour avoir une idée sur le nombre d'itération
  for( i = 0; i<17; i++) {  // parcourt du plateau
    for (j=0 ; j<25; j++) {
      if(games[gameId]["COLORS"][games[gameId]["player"]].indexOf(games[gameId]["gameBoard"][i][j])>-1) {       // si pion de l'IA
        games[gameId]["playedColor"]=games[gameId]["gameBoard"][i][j];                        // fait semblant qu'on va le déplacer
        games[gameId]["gameBoard"][i][j]=-1;                           //  (i, j) cellule depart
        getPath(games, gameId, [i,j], [-1,-1]);           // set in reachableCells all reachable cell
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
          if (games[gameId]["isPlayedByIa"][games[gameId]["player"]]===1)                    // niveau 1
              weight += Math.floor(Math.random()*1000)%30;                                   // random
          if (games[gameId]["isPlayedByIa"][games[gameId]["player"]]===2) {                  // sinon autre facteur
            weight += 10* (Math.pow((i-x0), 2) + (Math.pow((j-y0), 2)/3));    // max distance from depart
            weight -= 10* (Math.pow((x-x0), 2) + (Math.pow((y-y0), 2)/3));    // min distance de la case accesible à la pointe (ds le meilleur cas val=0
            // le code suivant pour rester sur la ligne droite entre le home et l'oppossé
            weight += 15* (Math.pow(axis*i+j+axis0, 2)/(Math.pow(axis, 2)+3));    // privilégier le pions les plus éloignés
            weight -= 15* (Math.pow(axis*x+y+axis0, 2)/(Math.pow(axis, 2)+3));    // privilégier les positions les plus proches
            for (l=0; l<3; l++) {                                                   // derniers pions
              var a = TRIANGLES_COORDS[games[gameId]["playedColor"]-1][l][0];
              var b = TRIANGLES_COORDS[games[gameId]["playedColor"]-1][l][1];          
              if (i===a && j===b){ 
                weight+= 4*games[gameId]["PLAYERS"][games[gameId]["player"]].score;
              }
            }
          }
              
          if (weight > maxWeight) {                                                      // compare
            maxWeight = weight;
            selectedMove = [[i, j], x, y];
          }
        }
      }
    }
  }
  games[gameId]["playedColor"] = games[gameId]["gameBoard"][selectedMove[0][0]][selectedMove[0][1]];                                    // ici on valide le meilleur choix
  console.log(count + " scénarios evaluated");
  games[gameId]["gameBoard"][selectedMove[0][0]][selectedMove[0][1]]=-1;
  path = getPath(games, gameId, selectedMove[0], [selectedMove[1],selectedMove[2]]);
  games[gameId]["history"][games[gameId]["player"]] = path;
  games[gameId]["Time"] += 500*(path.length-1);
  move(games, gameId, path, games[gameId]["playedColor"]);
  setTimeout(function() {
    io.sockets.in(gameId).emit('move', { path : path, playedColor: games[gameId]["playedColor"] });
    games[gameId]["isIaPlaying"] = false;
  }, games[gameId]["Time"]);
  games[gameId]["PLAYERS"][games[gameId]["player"]].score += 1;
  if (hasWon(games, gameId, games[gameId]["playedColor"])) {
    games[gameId]["gameOver"] = true;
    setTimeout(function() {
      io.sockets.in(gameId).emit('end game', { winner: games[gameId]["player"], score: games[gameId]["PLAYERS"][games[gameId]["player"]].score });
    }, games[gameId]["Time"]);
    sendScore(games, gameId, games[gameId]["PLAYERS"][games[gameId]["player"]], (error,data) => { // factoriser
      if (error) console.log('Echec de l\'envoi des scores à la BDD');
      else console.log('Envoi des scores à la BDD :', data);
    });
    return true; // pourquoi pas juste return ?
  }
  games[gameId]["player"] = (games[gameId]["player"]+1) % games[gameId]["numPlayers"];
  setTimeout(function() { io.sockets.in(gameId).emit('new turn', { player: games[gameId]["player"] }); }, games[gameId]["Time"]);
  games[gameId]["startCell"] = 0;
}
function validateMove(io, clients, games, gameId, socket, cell) {
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
  if (startCell === 0) { // premier click
    if (!(COLORS[player].indexOf(gameBoard[row][col])>-1)) { // vérifie qu'on click sur le pion du joueur qui a la main
      if (!isPlayedByIa[player]) socket.emit('game error', { message: "please click on your own pieces", sound: "fail" });
      else socket.emit('game error', { message: "please wait until computer finish playing", sound: "fail" });
      return false;
    }
    games[gameId]["startCell"] = [row,col];
    socket.emit('select', { cell : [row,col] });
    games[gameId]["playedColor"] = gameBoard[row][col];
    games[gameId]["gameBoard"][row][col] = -1;
    return false; // marquer la case depart vide pour ne pas l'utiliser comme pivot dans getJumps()
  }
  else {
    if (startCell[0] === row && startCell[1] === col) {  // retour à la case départ annule le mouvement
      games[gameId]["gameBoard"][row][col] = playedColor;
      games[gameId]["startCell"] = 0;
      socket.emit('deselect', { cell : [row,col], color: playedColor });
      return false;
    }
    if (gameBoard[row][col] !== -1) { // cell not empty
      socket.emit('game error', { message: "Cell not empty!", sound: "fail" });
      return false;
    }
    if (isMovingBackward(playedColor, startCell, [row,col])) { // mouvement illégal en réculant
      socket.emit('game error', { message: "You can't go back!", sound: "fail" });
      return false;
    }
    if (!(path = getPath(games, gameId, startCell, [row,col]))) { // mouvement invalide
      socket.emit('game error', { message: "Invalid move!", sound: "fail" });
      return false;
    }
    if (sameTraject(games, gameId, path)) {
      socket.emit('game error', { message: "You can't replay the last move", sound: "fail" });
      return false;
    }
    games[gameId]["history"][player] = path;
    games[gameId]["Time"] = 500*(path.length-1);
    move(games, gameId, path, games[gameId]["playedColor"]);
    io.sockets.in(gameId).emit('move', { path : path, playedColor: games[gameId]["playedColor"] });
    games[gameId]["PLAYERS"][player].score += 1;
    if (hasWon(games, gameId, playedColor)) {
      games[gameId]["gameOver"] = true;
      io.sockets.in(gameId).emit('end game', { winner: player, score: games[gameId]["PLAYERS"][player].score });
      sendScore(games, gameId, games[gameId]["PLAYERS"][player], (error,data) => { // factoriser
        if (error) console.log('Echec de l\'envoi des scores à la BDD');
        else console.log('Envoi des scores à la BDD :', data);
      });
      return true
    }
    games[gameId]["player"] = (player+1) % games[gameId]["numPlayers"];
    io.sockets.in(gameId).emit('new turn', { player: games[gameId]["player"] });
    games[gameId]["startCell"] = 0;
    return true;
  }
}

function move(games, gameId, path, playedColor) {
  var previous = path[0];
  var actuel = path[1];
  games[gameId]["gameBoard"][previous[0]][previous[1]] = -1;
  games[gameId]["gameBoard"][actuel[0]][actuel[1]] = playedColor;
  if (path.length > 2) {
    move(games, gameId, path.slice(1), playedColor);
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

function play (io, clients, games, gameId, socket, cell) {
  if (games[gameId]["gameOver"]) return false;
  if (!games[gameId]["isPlayedByIa"][games[gameId]["player"]])
    if (! validateMove(io, clients, games, gameId, socket, cell)) return false;
  setTimeout(function() { makeBestMove(io, games, gameId); }, games[gameId]["Time"]);
  if (games[gameId]["isPlayedByIa"][(games[gameId]["player"]+1)%games[gameId]["numPlayers"]]) {
    setTimeout(function() { play(io, clients, games, gameId); }, games[gameId]["Time"]);
  }
  games[gameId]["Time"] = 500;
  return true;
}
