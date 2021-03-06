/**
 * @module Server
 * @requires module:Shared
 * @requires http
 */

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

/** les coordonnées des cases du triangle d'arrivée pour chaque joueur */
var TRIANGLES_COORDS = [
 [[0,12],[1,11],[1,13],[2,10],[2,12],[2,14],[3,9],[3,11],[3,13],[3,15]],
 [[16,12],[15,11],[15,13],[14,10],[14,12],[14,14],[13,9],[13,11],[13,13],[13,15]],
 [[4,0],[4,2],[4,4],[4,6],[5,1],[5,3],[5,5],[6,2],[6,4],[7,3]],
 [[12,24],[12,22],[12,20],[12,18],[11,23],[11,21],[11,19],[10,22],[10,20],[9,21]],
 [[4,24],[4,22],[4,20],[4,18],[5,23],[5,21],[5,19],[6,22],[6,20],[7,21]],
 [[12,0],[12,2],[12,4],[12,6],[11,1],[11,3],[11,5],[10,2],[10,4],[9,3]]
];

/**
 * @description initialise une partie
 * <ul>
 *  <li> appelle : [Server.restart]{@link module:Server~restart}
 *  <li> appelée par : server.js
 *  <li> globales : -
 * @example
 * Server.init(games, "12314") // -> initialise toutes les variables de la partie 12314
 * @param {Object} games - Le dictionnaire contenant toutes les données des parties
 * @param {String} gameId - Le numéro de la partie
 * @return {undefined}
 */
function init(games, gameId) {
  games[gameId]["PLAYERS"] = [];
  for (var n=1; n<=games[gameId]["numPlayers"]; n++) {
    games[gameId]["PLAYERS"].push({ // crée la liste des joueurs
      name: games[gameId]["player"+n],
      score: 0,
      colors: games[gameId]["COLORS"][n-1],
      number: n
    });
  }
  games[gameId]["Time"] = 500; // le temps entre chaque coup
  restart(games, gameId); // démarre la partie
}

/**
 * @description recommence une partie
 * <ul>
 *  <li> appelle :
 *    <ul>
 *      <li> [Shared.initGameBoard]{@link module:Shared~initGameBoard}
 *      <li> [Shared.initArray]{@link module:Shared~initArray}
 *    </ul>
 *  <li> appelée par :
 *    <ul>
 *      <li> [Server.init]{@link module:Server~init}
 *      <li> server.js
 *    </ul>
 *  <li> globales : -
 * @example
 * Server.restart(games, "12314") // -> réinitialise les variables de la partie 12314
 * @param {Object} games - Le dictionnaire contenant toutes les données des parties
 * @param {String} gameId - Le numéro de la partie
 * @return {undefined}
 */
function restart(games, gameId) {
  games[gameId]["gameBoard"] = Shared.initGameBoard(); // initialise la matrice représentant le plateau de jeu
  for (var n=0; n < games[gameId]["numPlayers"]; n++) { // remet les scores à 0
    games[gameId]["PLAYERS"][n].score = 0;
  }
  games[gameId]["player"] = 0;
  games[gameId]["startCell"] =  0; // remet la case de départ à 0
  games[gameId]["gameOver"] = false; // la partie n'est pas finie
  games[gameId]["gameState"] = Shared.initArray(games[gameId]["numPlayers"], games[gameId]["numColors"], false); // réinitialise la progression des joueurs
  games[gameId]["history"] = Shared.initArray(games[gameId]["numPlayers"], 0, false); // réinitialise l'historique des joueurs
  games[gameId]["restartCount"] = 0; // réinitialise le compteur de demandes de nouvelle partie
}

/**
 * @description permet de savoir si un joueur essaie de déplacer un pion vers l'arrière (vers son triangle de départ)
 * <ul>
 *  <li> appelle : -
 *  <li> appelée par :
 *    <ul>
 *      <li> [Server.getPath]{@link module:Server~getPath}
 *      <li> [Server.getJumps]{@link module:Server~getJumps}
 *      <li> [Server.validateMove]{@link module:Server~validateMove}
 *    </ul>
 *  <li> globales : -
 * @example
 * Server.isMovingBackward(1,[8,12],[7,11]) // -> true
 * Server.isMovingBackward(4,[8,12],[8,10]) // -> false
 * @param {Int} color - Le numéro de la couleur
 * @param {Int[]} startCell - Les coordonnées de la case de départ
 * @param {Int[]} endCell - Les coordonnées de la case d'arrivée
 * @return {Boolean} true si le mouvement est orienté vers l'arrière, false sinon
 */
function isMovingBackward(color, startCell, endCell) {
  // remplacer par switch ?
  if (color===1)  return endCell[0] - startCell[0] < 0;
  if (color===2)  return endCell[0] - startCell[0] > 0;
  if (color===3) return endCell[1] + endCell[0] - startCell[1] - startCell[0] < 0;
  if (color===4) return endCell[1] + endCell[0] - startCell[1] - startCell[0] > 0;
  if (color===5) return endCell[1] - endCell[0] - startCell[1] + startCell[0] > 0;
  if (color===6) return endCell[1] - endCell[0] - startCell[1] + startCell[0] < 0;
}

/**
 * @description permet de savoir si le joueur dont c'est le tour essaie de refaire son dernier déplacement à l'envers
 * <ul>
 *  <li> appelle : -
 *  <li> appelée par :
 *    <ul>
 *      <li> [Server.getPath]{@link module:Server~getPath}
 *      <li> [Server.getJumps]{@link module:Server~getJumps}
 *      <li> [Server.validateMove]{@link module:Server~validateMove}
 *    </ul>
 *  <li> globales : -
 * @example
 * Server.sameTraject(games, "12314", [[8,12],[8,14],[10,14]]) // -> true si le dernier déplacement de ce joueur était [[10,14],[8,14],[8,12]], false sinon
 * @param {Object} games - Le dictionnaire contenant toutes les données des parties
 * @param {String} gameId - Le numéro de la partie
 * @param {Int[][]} path - La liste des coordonnées des cases constituant le déplacement
 * @return {Boolean} true si c'est le même trajet à l'envers, false sinon
 */
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

/**
 * @description calcule le chemin nécessaire pour relier deux cases
 * <ul>
 *  <li> appelle :
 *    <ul>
 *      <li> [Server.isOnGameBoard]{@link module:Server~isOnGameBoard}
 *      <li> [Server.isMovingBackward]{@link module:Server~isMovingBackward}
 *      <li> [Server.sameTraject]{@link module:Server~sameTraject}
 *      <li> [Server.getJumps]{@link module:Server~getJumps}
 *    </ul>
 *  <li> appelée par :
 *    <ul>
 *      <li> [Server.makeBestMove]{@link module:Server~makeBestMove}
 *      <li> [Server.validateMove]{@link module:Server~validateMove}
 *      <li> [Server.negmax]{@link module:Server~negmax}
 *      <li> [Server.alphabeta]{@link module:Server~alphabeta}
 *    </ul>
 *  <li> globales : -
 * @example
 * // partie 12314 : position des pions
 * // [4,12], [5,9], [6,14], [7,9], [11,11], [15,13], [8,12]
 * Server.getPath(games, "12314", [8,12],[16,12]]) // -> [[8,12],[4,16],[4,8],[6,10],[8,8],[14,14],[16,12]]
 * Server.getPath(games, "12314", [8,12],[7,13]]) // -> [[8,12],[7,13]]
 * Server.getPath(games, "12314", [8,12],[3,9]]) // -> false
 * @param {Object} games - Le dictionnaire contenant toutes les données des parties
 * @param {String} gameId - Le numéro de la partie
 * @param {Int[]} startCell - Les coordonnées de la case de départ
 * @param {Int[]} endCell - Les coordonnées de la case d'arrivée
 * @return {Int[][]|Boolean} Si un chemin a été trouvé, retourne la liste des coordonnées des cases le constituant, sinon retourne false
 */
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

/**
 * @description calcule les sauts nécessaires pour relier deux cases
 * <ul>
 *  <li> appelle :
 *    <ul>
 *      <li> [Server.isOnGameBoard]{@link module:Server~isOnGameBoard}
 *      <li> [Server.isMovingBackward]{@link module:Server~isMovingBackward}
 *      <li> [Server.sameTraject]{@link module:Server~sameTraject}
 *      <li> [Server.contains]{@link module:Server~contains}
 *    </ul>
 *  <li> appelée par : [Server.getPath]{@link module:Server~getPath}
 *  <li> globales : -
 * @example
 * // partie 12314 : position des pions
 * // [8,12], [6,12], [7,11], [7,13], [8,10], [8,14], [9,11], [9,13], [10,12]
 * Server.getJumps(games, "12314", [[8,12]], [4,12], []) // -> games[12314]["path"] = []
 * Server.getJumps(games, "12314", [[8,12]], [6,14], []) // -> games[12314]["path"] = [
 * // [ [ 8, 12 ], [ 6, 14 ] ],
 * // [ [ 8, 12 ], [ 6, 10 ], [ 6, 14 ] ] ]
 * Server.getJumps(games, "12314", [[8,12]], [8,16]], []) // -> games[12314]["path"] = [ [ [ 8, 12 ], [ 8, 16 ] ] ]
 * @param {Object} games - Le dictionnaire contenant toutes les données des parties
 * @param {String} gameId - Le numéro de la partie
 * @param {Int[][]}  cells - Les coordonnées des cases de départ potentielles
 * @param {Int[]} endCell - Les coordonnées de la case d'arrivée
 * @param {Int[][]} oldPath - Le chemin déjà parcouru
 * @return {undefined} modifie <i>games</i>[<i>gameId</i>]["path"]
 */
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

/**
 * @description permet de savoir si un joueur a gagné avec son dernier mouvement
 * <ul>
 *  <li> appelle : -
 *  <li> appelée par :
 *    <ul>
 *      <li> [Server.makeBestMove]{@link module:Server~makeBestMove}
 *      <li> [Server.validateMove]{@link module:Server~validateMove}
 *      <li> [Server.negmax]{@link module:Server~negmax}
 *  <li> globales : -
 * @example
 * // games[12314][gameState] = [[false,true,true],[true,false,true]]
 * Server.hasWon(games, "12314", 1) // -> true si tous les pions orange sont dans leur triangle d'arrivée, false sinon
 * Server.hasWon(games, "12314", 4) // -> true si tous les pions bleu clair sont dans leur triangle d'arrivée, false sinon
 * @param {Object} games - Le dictionnaire contenant toutes les données des parties
 * @param {String} gameId - Le numéro de la partie
 * @param {Int} color - Le chiffre représentant la dernière couleur jouée
 * @return {Boolean} true si le joueur qui a joué cette couleur a gagné, false sinon
 */
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

/**
 * @description permet de savoir si une case est sur le plateau de jeu (utilisée par l'IA)
 * <ul>
 *  <li> appelle : -
 *  <li> appelée par :
 *    <ul>
 *      <li> [Server.getPath]{@link module:Server~getPath}
 *      <li> [Server.getJumps]{@link module:Server~getJumps}
 *  <li> globales : -
 * @example
 * Server.isOnGameBoard([-1,12]) // -> false
 * Server.isOnGameBoard([4,16]) // -> true
 * @param {Int[]} cell - Les coordonnées de la case
 * @return {Boolean} true si case est sur le plateau de jeu, false sinon
 */
function isOnGameBoard(cell) {
  return (cell[0] > -1 && cell[0] < 17 && cell[1] > -1 && cell[1] < 25);
}

/**
 * @description permet de savoir si un Array contient un certain élément
 * <ul>
 *  <li> appelle : -
 *  <li> appelée par : [Server.getJumps]{@link module:Server~getJumps}
 *  <li> globales : -
 * @example
 * Server.contains([1,2,3], 2) // -> true
 * Server.contains(['1','2','3'], 2) // -> false
 * Server.contains([[2,3],[1,5],[1,2]], [1,2]) -> true
 * Server.contains([[2,3],[3,5],[4,2]], [1,2]) -> false
 * @param {Array} array - Un Array
 * @param {*} element - Un élément quelconque
 * @return {Boolean} true si <i>array </i> contient <i>element</i>, false sinon
 */
 function contains(array, element) {
  var i = array.length;
  while (i--) {
    if (array[i][0]==element[0] && array[i][1] == element[1]) {
      return true;
    }
  }
  return false;
}

/**
 * @description envoie les données de la partie à la base de données
 * <ul>
 *  <li> appelle : -
 *  <li> appelée par :
 *    <ul>
 *      <li> [Server.makeBestMove]{@link module:Server~makeBestMove}
 *      <li> [Server.validateMove]{@link module:Server~validateMove}
 *      <li> [Server.negmax]{@link module:Server~negmax}
 *  <li> globales : -
 * @example
 * Server.sendScore(games, "12314", games[12314]["PLAYERS"][0], (error,data) => {
 * //   if (error) console.log('Echec de l\'envoi des scores à la BDD');
 * //   else console.log('Envoi des scores à la BDD :', data);
 * // }); // -> essaie d'ajouter les scores à la BDD et affiche un message en cas d'erreur ou de succès
 * @param {Object} games - Le dictionnaire contenant toutes les données des parties
 * @param {String} gameId - Le numéro de la partie
 * @param {Player} winner - Le vainqueur
 * @param {Function} callback - La fonction à appeler après l'envoi
 * @return {undefined} modifie la base de données
 */
function sendScore(games, gameId, winner, callback) {
  // encode les éléments avant envoi
  var name = encodeURIComponent(winner.name);
  var score = encodeURIComponent(winner.score);
  var adversaires = games[gameId]["PLAYERS"].filter(item => item !== winner); // enlève le vainqueur de la liste
  adversaires.forEach(function(value, index, array) {
    array[index] = encodeURIComponent(value.name);
  })
  var request = http.get('http://hop-hop-hop.herokuapp.com/score?name=' + name + '&score=' + score + '&adversaire1=' + adversaires[0] + '&adversaire2=' + adversaires[1] + '&adversaire3=' + adversaires[2] + '&adversaire4=' + adversaires[3] + '&adversaire5=' + adversaires[4], function(response) { // crée la requête GET pour la page de scores
   var data = '';
   response.on('data', function(chunk) { // fonction exécutée chaque fois que des données sont reçues
        data += chunk; // ajoute les données aux données déjà reçues
   });
   response.on('end', function() { // à la fin de la requête
      callback(null, data); // applique la fonction de callback
  });
 })
 request.on('error', function(error){ // en cas d'erreur
   callback(error); // applique la fonction de callback
 });
 request.end(); // termine la requête
}

/**
 * @description fait jouer l'IA
 * <ul>
 *  <li> appelle :
 *    <ul>
 *      <li> [Server.getPath]{@link module:Server~getPath}
 *      <li> [Server.move]{@link module:Server~move}
 *      <li> [Server.hasWon]{@link module:Server~hasWon}
 *      <li> [Server.sendScore]{@link module:Server~sendScore}
 *    </ul>
 *  <li> appelée par : [Server.play]{@link module:Server~play}
 *  <li> globales : -
 * @example
 * Server.makeBestMove(io,games,"12314") // -> l'IA joue
 * @param {Object} io - L'instance de socket.io
 * @param {Object} games - Le dictionnaire contenant toutes les données des parties
 * @param {String} gameId - Le numéro de la partie
 * @return {undefined|Boolean} retourne true si l'IA gagne, undefined sinon
 * @emits 'move'
 * @emits 'new turn'
 */
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

/**
 * @description valide un mouvement et effectue les actions correspondantes
 * <ul>
 *  <li> appelle :
 *    <ul>
 *      <li> [Server.getPath]{@link module:Server~getPath}
 *      <li> [Server.isMovingBackward]{@link module:Server~isMovingBackward}
 *      <li> [Server.sameTraject]{@link module:Server~sameTraject}
 *      <li> [Server.move]{@link module:Server~move}
 *      <li> [Server.hasWon]{@link module:Server~hasWon}
 *      <li> [Server.sendScore]{@link module:Server~sendScore}
 *    </ul>
 *  <li> appelée par : [Server.play]{@link module:Server~play}
 *  <li> globales : -
 * @example
 * // clients = {
 * //   23 : {
 * //     ...
 * //   }
 * // }
 * // socket = {
 * //   id: 23
 * //     ...
 * // }
 * Server.validateMove(io,clients,games,"12314",socket,[8,12]) // -> le joueur sur la socket avec l'id 23 joue la case [8,12]
 * @param {Object} io - L'instance de socket.io
 * @param {Object} clients - Le dictionnaire contenant toutes les données des utilisateurs connectés
 * @param {Object} games - Le dictionnaire contenant toutes les données des parties
 * @param {String} gameId - Le numéro de la partie
 * @param {Object} socket - La connection du client à socket.io
 * @param {Int[]} cell - Les coordonnées de la case jouée
 * @return {Boolean} retourne true si le mouvement est valide, false sinon
 * @emits game error
 * @emits select
 * @emits deselect
 * @emits move
 * @emits end game
 * @emits new turn
 */
function validateMove(io, clients, games, gameId, socket, cell) {
  var player = games[gameId]["player"];
  if (player !== clients[socket.id]["number"] || games[gameId]["isIaPlaying"]) { // si ce n'est pas le tour du joueur
    /**
    * @event game error
    * @description envoie un message d'erreur au client
    * @type {Object}
    * @property {String} message - Le message d'erreur
    * @property {String} sound - Le nom du son à jouer
    */
    socket.emit('game error', { message: 'Veuillez attendre votre tour', sound: "fail" });
    return;
  }
  var row = cell[0];
  var col = cell[1];
  // récupère les données de la partie
  var startCell = games[gameId]["startCell"];
  var COLORS = games[gameId]["COLORS"];
  var playedColor = games[gameId]["playedColor"];
  var gameBoard = games[gameId]["gameBoard"];
  var history = games[gameId]["history"];
  var Time = games[gameId]["Time"];
  var isPlayedByIa = games[gameId]["isPlayedByIa"];
  if (startCell === 0) { // si c'est un premier clic
    if (!(COLORS[player].indexOf(gameBoard[row][col])>-1)) { // si le joueur n'a pas cliqué sur un de ses pions
      /** @see event:game error */
      if (!isPlayedByIa[player]) socket.emit('game error', { message: "Veuillez cliquer sur vos propres pions", sound: "fail" });
      /** @see event:game error */
      else socket.emit('game error', { message: "Veuillez attendre que l'ordinateur finisse de jouer", sound: "fail" });
      return false;
    }
    games[gameId]["startCell"] = [row,col]; // case de départ
    /**
    * @event select
    * @description demande au client de sélectionner une case
    * @type {Object}
    * @property {Int[]} cell
    */
    socket.emit('select', { cell : [row,col] }); // avertit le joueur que la case est sélectionnée
    games[gameId]["playedColor"] = gameBoard[row][col]; // couleur jouée
    games[gameId]["gameBoard"][row][col] = -1; // marque la case de départ vide pour ne pas l'utiliser comme pivot
    return false;
  }
  else { // si c'est un second clic
    if (startCell[0] === row && startCell[1] === col) {  // si le joueur a cliqué sur la case de départ
      games[gameId]["gameBoard"][row][col] = playedColor; // remet le pion à sa place
      games[gameId]["startCell"] = 0; // réinitialise la case de départ
      /**
      * @event deselect
      * @description demande au client de désélectionner une case
      * @type {Object}
      * @property {Int[]} cell
      * @property {Int} color
      */
      socket.emit('deselect', { cell : [row,col], color: playedColor }); // avertit le joueur que la case est désélectionnée
      return false;
    }
    if (gameBoard[row][col] !== -1) { // si la case est occupée
      /** @see event:game error */
      socket.emit('game error', { message: "Cette case est déjà occupée !", sound: "fail" });
      return false;
    }
    if (isMovingBackward(playedColor, startCell, [row,col])) { // si le joueur essaie de reculer
      /** @see event:game error */
      socket.emit('game error', { message: "Vous ne pouvez pas revenir en arrière", sound: "fail" });
      return false;
    }
    if (!(path = getPath(games, gameId, startCell, [row,col]))) { // mouvement invalide
      /** @see event:game error */
      socket.emit('game error', { message: "Mouvement impossible", sound: "fail" });
      return false;
    }
    if (sameTraject(games, gameId, path)) { // si le joueur refait son dernier mouvement à l'envers
      /** @see event:game error */
      socket.emit('game error', { message: "Vous ne pouvez pas refaire le même mouvement", sound: "fail" });
      return false;
    }
    // si le mouvement est validé
    games[gameId]["history"][player] = path; // mémorise le chemin
    games[gameId]["Time"] = 500*(path.length-1); // temps pour effectuer le déplacement à l'écran
    move(games, gameId, path, games[gameId]["playedColor"]); // déplace le pion
    /**
    * @event move
    * @description demande au client de déplacer un pion
    * @type {Object}
    * @property {Int[][]} path - La liste des coordonnées des cases
    * @property {Int} playedColor - Le numéro de la couleur jouée
    */
    io.sockets.in(gameId).emit('move', { path : path, playedColor: games[gameId]["playedColor"] }); // avertit les joueurs du mouvement à effectuer
    games[gameId]["PLAYERS"][player].score += 1; // compte le nombre de coups du joueur
    if (hasWon(games, gameId, playedColor)) { // si le joueur a gagné
      games[gameId]["gameOver"] = true; // finit la partie
      /**
      * @event end game
      * @description demande au client d'afficher la fin de la partie
      * @type {Object}
      * @property {Int} winner - L'index du vainqueur dans PLAYERS
      * @property {Int} score - Le score du vainqueur
      */
      io.sockets.in(gameId).emit('end game', { winner: player, score: games[gameId]["PLAYERS"][player].score }); // avertit les joueurs du vainqueur
      sendScore(games, gameId, games[gameId]["PLAYERS"][player], (error,data) => { // factoriser
        if (error) console.log('Echec de l\'envoi des scores à la BDD');
        else console.log('Envoi des scores à la BDD :', data);
      }); // envoie les données de la partie à la base de données
      return true
    }
    games[gameId]["player"] = (player+1) % games[gameId]["numPlayers"]; // passe au joueur suivant
    /**
    * @event new turn
    * @description avertit le client du nouveau tour de jeu
    * @type {Object}
    * @property {Int[]} player - Le numéro du joueur dont c'est le tour (de 0 à 5)
    */
    io.sockets.in(gameId).emit('new turn', { player: games[gameId]["player"] }); // avertit les joueurs du nouveau tour de jeu
    games[gameId]["startCell"] = 0; // réinitialise la case de départ
    return true;
  }
}

/**
 * @description déplace un pion sur le plateau de jeu
 * <ul>
 *  <li> appelle : -
 *  <li> appelée par :
 *    <ul>
 *      <li> [Server.validateMove]{@link module:Server~validateMove}
 *      <li> [Server.makeBestMove]{@link module:Server~makeBestMove}
 *      <li> [Server.negmax]{@link module:Server~negmax}
 *    </ul>
 *  <li> globales : -
 * @example
 * Server.move(games,"12314",[[8,12],[10,14]],1) // -> déplace un pion orange de [8,12] en [10,14]
 * @param {Object} games - Le dictionnaire contenant toutes les données des parties
 * @param {String} gameId - Le numéro de la partie
 * @param {Int[][]} path - Les coordonnées de la case jouée
 * @param {Int} playedColor - Le numéro de la couleur jouée
 * @return {undefined} modifie <i>games</i>[<i>gameId</i>]["gameBoard"]
 */
function move(games, gameId, path, playedColor) {
  var previous = path[0];
  var actuel = path[1];
  games[gameId]["gameBoard"][previous[0]][previous[1]] = -1; // marque la case vide
  games[gameId]["gameBoard"][actuel[0]][actuel[1]] = playedColor; // déplace le pion
  if (path.length > 2) { // s'il reste des sauts à effectuer
    move(games, gameId, path.slice(1), playedColor); // réitère l'opération
  }
}

/**
 * @description échappe les caractères HTML (pour éviter la faille XSS)
 * <ul>
 *  <li> appelle : -
 *  <li> appelée par : server.js
 *  <li> globales : -
 * @example
 * Server.escapeHtml("<script>") // -> "&ltscript&gt"
 * @param {String} text - La chaîne à convertir
 * @return {String} La chaîne avec les caractères HTML remplacés
 */
function escapeHtml(text) {
  if (typeof(text) === 'undefined') return text
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

/**
 * @description joue un coup
 * <ul>
 *  <li> appelle :
 *    <ul>
 *      <li> [validateMove]{@link Server~validateMove}
 *      <li> [makeBestMove]{@link Server~makeBestMove}
 *  <li> appelée par : server.js
 *  <li> globales : -
 * @example
 * Server.play(io,clients,games,"12314",socket,[8,12]) // -> un client joue la case [8,12]
 * @param {Object} io - L'instance de socket.io
 * @param {Object} clients - Le dictionnaire contenant toutes les données des utilisateurs connectés
 * @param {Object} games - Le dictionnaire contenant toutes les données des parties
 * @param {String} gameId - Le numéro de la partie
 * @param {Object} socket - La connection du client à socket.io
 * @param {Int[]} cell - Les coordonnées de la case jouée
 * @return {Boolean} - true si le coup a été joué, false sinon
 */
function play (io, clients, games, gameId, socket, cell) {
  if (games[gameId]["gameOver"]) return false; // si la partie est finie
  if (!games[gameId]["isPlayedByIa"][games[gameId]["player"]]) // si le joueur n'est pas contrôlé par l'IA
    if (! validateMove(io, clients, games, gameId, socket, cell)) return false; // si le mouvement est invalide
  // si le joueur est contrôlé par l'IA
  setTimeout(function() { makeBestMove(io, games, gameId); }, games[gameId]["Time"]); // fait jouer l'IA
  if (games[gameId]["isPlayedByIa"][(games[gameId]["player"]+1)%games[gameId]["numPlayers"]]) { // si le joueur suivant est aussi joué par l'IA
    setTimeout(function() { play(io, clients, games, gameId); }, games[gameId]["Time"]); // fat jouer l'IA
  }
  games[gameId]["Time"] = 500; // réinitalise le temps entre chaque coup
  return true;
}

/** root function pour minmax algorithme - la profondeur choisie est 3 on peut en faire un paramètre pour les tests */
function negmax(io, games, gameId) {
  if (!games[gameId]["isPlayedByIa"][games[gameId]["player"]]) return;
  if (games[gameId]["gameOver"]) return;       // Isover
  games[gameId]["isIaPlaying"] = 2;
  var i, j, k;             // var pour itération
  var depth=3;             // profondeur
  var selectedMove = [];
  var bestmove=-9999;
  var players= [[],[]];
  var color, score, liste;
  console.log("I'm the negmax algo, i'm thinking...for player: "+games[gameId]["player"]);
  // set in players agent color and adverser color // minmax for multiplayer
  for (var i=0; i< games[gameId]["COLORS"][games[gameId]["player"]].length; i++) {
    color = games[gameId]["COLORS"][games[gameId]["player"]][i];
    players[0].push(color);
    var n =  (color%2 ? color+1 : color-1);
    players[1].push(n);
  }
  for( i = 0; i<17; i++) {                              // parcourt du plateau
    for (j=0 ; j<25; j++) {
      if(games[gameId]["COLORS"][games[gameId]["player"]].indexOf(games[gameId]["gameBoard"][i][j])>-1) {       // si pion de l'IA
        color =games[gameId]["gameBoard"][i][j];                        // fait semblant qu'on va le déplacer
        games[gameId]["playedColor"]= color
        games[gameId]["gameBoard"][i][j]=-1;                           //  (i, j) cellule depart
        getPath(games, gameId, [i,j], [-1,-1]);           // set in reachableCells all reachable cell
        liste = games[gameId]["reachableCells"];          // créer une copie //l'utilisation des variables globales avec récursion change leur valeur
        for(k=0; k< liste.length; k++){    // pour chaque coup possible simule le mouvement
          x = liste[k][0];  y = liste[k][1];            // (x, y) cellule accesible a partir de (i, j)
          games[gameId]["gameBoard"][x][y] = color;                    // simule le mouvement
          score = alphabeta(io, games, gameId, depth-1, -10000, 10000, 1, players);
          games[gameId]["gameBoard"][x][y] = -1                                 // anulle le mouvement
          if (score >= bestmove){
            bestmove = score ;
            selectedMove = [[i, j] , x, y];
          }
        }
        games[gameId]["gameBoard"][i][j]= color;    // annuler le coup
      }
    }
  }
  games[gameId]["playedColor"] = games[gameId]["gameBoard"][selectedMove[0][0]][selectedMove[0][1]];              // ici on valide le meilleur choix
  games[gameId]["gameBoard"][selectedMove[0][0]][selectedMove[0][1]]=-1;
  path = getPath(games, gameId, selectedMove[0], [selectedMove[1],selectedMove[2]]);
  games[gameId]["history"][games[gameId]["player"]] = path;
  games[gameId]["Time"] += 500*(path.length-1);
  move(games, gameId, path, games[gameId]["playedColor"]);
  setTimeout(function() {
    /** @see event:move */
    io.sockets.in(gameId).emit('move', { path : path, playedColor: games[gameId]["playedColor"] });
    games[gameId]["isIaPlaying"] = false;
  }, games[gameId]["Time"]); // avertit les joueurs du mouvement à effectuer
  games[gameId]["PLAYERS"][games[gameId]["player"]].score += 1; // compte le nombre de coups
  if (hasWon(games, gameId, games[gameId]["playedColor"])) { // si l'IA a gagné
    games[gameId]["gameOver"] = true; // termine la partie
    setTimeout(function() {
      /** @see event:end game */
      io.sockets.in(gameId).emit('end game', { winner: games[gameId]["player"], score: games[gameId]["PLAYERS"][games[gameId]["player"]].score }); // avertit les joueurs du vainqueur
    }, games[gameId]["Time"]);
    sendScore(games, gameId, games[gameId]["PLAYERS"][games[gameId]["player"]], (error,data) => { // factoriser
      if (error) console.log('Echec de l\'envoi des scores à la BDD');
      else console.log('Envoi des scores à la BDD :', data);
    }); // envoie les données de la partie à la BDD
    return true; // pourquoi pas juste return ?
  }
  games[gameId]["player"] = (games[gameId]["player"]+1) % games[gameId]["numPlayers"]; // passe au joueur suivant
  setTimeout(function() {
    /** @see event:new turn */
    io.sockets.in(gameId).emit('new turn', { player: games[gameId]["player"] }); }, games[gameId]["Time"]); // avertit les joueurs du nouveau tour
  games[gameId]["startCell"] = 0; // réinitialise la case de départ
}

/** fonction negmax avec alpha beta coupure */
function alphabeta(io, games, gameId, depth, alpha, beta, isMin, players) {
  var i, j, k;             // var pour itération
  var x, y;
  var color, score=-10000;
  var liste;
  if (games[gameId]["gameOver"] || depth == 0)
    return (isMin%2? 1: -1) * evaluate(games[gameId]["gameBoard"], players);
  for( i = 0; i<17; i++) {                    // parcourt du plateau
    for (j=0 ; j<25; j++) {
      if(players[isMin].indexOf(games[gameId]["gameBoard"][i][j])>-1) {  // si pion du joueur
        color=games[gameId]["gameBoard"][i][j];                          // on crée des copie car les variables globale change de valeur avec récursion
        games[gameId]["playedColor"]=color;
        games[gameId]["gameBoard"][i][j]=-1;
        getPath(games, gameId, [i,j], [-1,-1]);           // set in reachableCells all reachable cell
        liste = games[gameId]["reachableCells"];          // créer une copie
        for(k=0; k< liste.length; k++){    // pour chaque coup possible simule le mouvement ;
          x = liste[k][0];  y = liste[k][1];            // (x, y) cellule accesible a partir de (i, j)
          games[gameId]["gameBoard"][x][y] = color;                    // simule le mouvement
          score = Math.max(score, -alphabeta(io, games, gameId, depth - 1, -beta, -alpha, +!isMin, players));
          games[gameId]["gameBoard"][x][y] = -1;   // annuler le coup;
          alpha = Math.max(alpha, score)
          // purning
          if (alpha >= beta)
            break;
        }
        games[gameId]["gameBoard"][i][j] = color; // rétablir le pion a sa position initaile
      }
    }
  }
  return alpha;
}

/** fonction d'evaluation; = ∑ di - ∑ dj // di est la distance d'un pion de l'adverasaire du trangle opposée,
di est la distance d'un pion de l'agent du trangle opposée,
une situation avantageuse si les distances de l'agent sont les plus petites  et de l'adversaire les plus grandes */
function evaluate(gameBoard, players) {
  var i, j, n, color;
  var value=0;
  for( i = 0; i<17; i++) {
    for (j=0 ; j<25; j++) {
      if(players[0].indexOf(gameBoard[i][j])>-1) {
        color = gameBoard[i][j];
        n =  (color%2 ? color : color-2);
        x0= TRIANGLES_COORDS[n][0][0] ;y0= TRIANGLES_COORDS[n][0][1]  // (x0, y0) pointe du triangle opposé // on souhaite diminuer au max la distance
        value -= (Math.pow((i-x0), 2) + (Math.pow((j-y0), 2)/3));  // on souhaite diminuer au max la distance
      }
      if(players[1].indexOf(gameBoard[i][j])>-1) {
        color = gameBoard[i][j];
        n =  (color%2 ? color : color-2);
        x0= TRIANGLES_COORDS[n][0][0] ;y0= TRIANGLES_COORDS[n][0][1];
        value += Math.pow((i-x0), 2) + (Math.pow((j-y0), 2)/3);
      }
    }
  }
  return value;
}
