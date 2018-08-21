import test from 'ava';
import sinon from 'sinon';

var rewire = require('rewire'); // pour les spies

var http = require('http'); // pour simuler une requête HTTP
var PassThrough = require('stream').PassThrough;

var Server = rewire('./server.js'); // le fichier contenant les fonctions à tester
var Shared = require('./shared.js'); // fonctions utilitaires

var winningBoard = [ // tous les joueurs ont gagné
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
      [false,false,false,false,false,false,false,false,false,false,false,false,  1  ,false,false,false,false,false,false,false,false,false,false,false,false] ]

Server.__set__('console.log', () => {}); // supprime tout affichage dans la console

var emitData = []; // pour mémoriser les messages émis par le serveur

// pour contourner les méthodes réseau

function emit(message,data) {
    emitData.push([message,data]);
}

var socket = {
  id : 23,
  emit : emit
}

var io = {
  sockets : {
    in : function(gameId) {
      return {
        emit : emit
      };
    }
  }
}

var clients = {
  23 : {
    number : 0
  }
}

// var clock = sinon.useFakeTimers();
var timedOut;
function setTimeout(f,t) { // pour ne pas attendre
  timedOut = f;
}

test('Echapper les caractères HTML', t => {
  t.is(Server.escapeHtml('<script>'),'&lt;script&gt;');
});

test('Recommencer la partie', t => {
  var games = {
    1: {
      numPlayers : 2,
      numColors : 3,
      player1 : 'Marc',
      player2 : 'Joueur 2',
      numHumanPlayers : 2,
      isPlayedByIa : [false,false],
      COLORS : [[1,3,5],[2,4,6]],
      PLAYERS : [
         { colors: [1,3,5],
           name: 'Marc',
           number: 1,
           score: 52
         },
         { colors: [2,4,6],
           name: 'Joueur 2',
           number: 2,
           score: 51
         } ],
      Time : 500,
      gameBoard : [false, 1, 2, false],
      gameOver : true,
      gameState : [[true, true, true], [true, true, false]],
      history : [[[12,8],[10,8]], [[16,5],[16,7]]],
      isIaPlaying : false,
      player : 52,
      restartCount : 2,
      startCell : [12,8]
    },
    2: {
      numPlayers : 4,
      numColors : 1,
      COLORS : [[1],[2],[3],[4]],
      player1 : 'Marc',
      player2 : 'Sophie',
      player3 : 'Antoine',
      player4 : 'Luc',
      PLAYERS : [
         { colors: [1],
           name: 'Marc',
           number: 1,
           score: 32
         },
         { colors: [2],
           name: 'Sophie',
           number: 2,
           score: 32
         },
         { colors: [3],
           name: 'Antoine',
           number: 3,
           score: 32
         },
         { colors: [4],
           name: 'Luc',
           number: 4,
           score: 33
         }
      ],
      Time : 500,
      gameBoard : [1,2,3,4],
      gameOver : false,
      gameState : [[false], [false], [false], [false]],
      history : [[[12,8],[12,10]], [[12,8],[12,10]], [[12,8],[12,10]], [[12,8],[12,10]]],
      player : 155,
      restartCount : 0,
      startCell : [12,8],
      isIaPlaying : false,
      isPlayedByIa : [false, false, false, false],
      numHumanPlayers : 4
    },
    3: {
      numPlayers :2,
      numColors : 1,
      player1 : 'Joueur 1',
      player2 : 'Ordinateur',
      numHumanPlayers : 1,
      isPlayedByIa : [false,true],
      COLORS : [[1],[2]],
      PLAYERS : [
         { colors: [1],
           name: 'Joueur 1',
           number: 1,
           score: 22
         },
         { colors: [2],
           name: 'Ordinateur',
           number: 2,
           score: 23,
         } ],
      Time : 500,
      gameBoard : [1,2,1,2],
      gameOver : true,
      gameState : [[false], [true]],
      history : [[[5,10],[10,8]], [[5,8],[7,9]]],
      isIaPlaying : false,
      player : 45,
      restartCount : 1,
      startCell : [5,8]
    }
  };
  var expected = {
    1: {
      numPlayers : 2,
      numColors : 3,
      player1 : 'Marc',
      player2 : 'Joueur 2',
      numHumanPlayers : 2,
      isPlayedByIa : [false,false],
      COLORS : [[1,3,5],[2,4,6]],
      PLAYERS : [
         { colors: [1,3,5],
           name: 'Marc',
           number: 1,
           score: 0
         },
         { colors: [2,4,6],
           name: 'Joueur 2',
           number: 2,
           score: 0,
         } ],
      Time : 500,
      gameBoard : Shared.initGameBoard(),
      gameOver : false,
      gameState : [[false, false, false], [false, false, false]],
      history : [false, false],
      isIaPlaying : false,
      player : 0,
      restartCount : 0,
      startCell : 0
    },
    2: {
      numPlayers : 4,
      numColors : 1,
      COLORS : [[1],[2],[3],[4]],
      player1 : 'Marc',
      player2 : 'Sophie',
      player3 : 'Antoine',
      player4 : 'Luc',
      PLAYERS : [
         { colors: [1],
           name: 'Marc',
           number: 1,
           score: 0
         },
         { colors: [2],
           name: 'Sophie',
           number: 2,
           score: 0,
         },
         { colors: [3],
           name: 'Antoine',
           number: 3,
           score: 0
         },
         { colors: [4],
           name: 'Luc',
           number: 4,
           score: 0
         }
      ],
      Time : 500,
      gameBoard : Shared.initGameBoard(),
      gameOver : false,
      gameState : [[false], [false], [false], [false]],
      history : [false, false, false, false],
      player : 0,
      restartCount : 0,
      startCell : 0,
      isIaPlaying : false,
      isPlayedByIa : [false, false, false, false],
      numHumanPlayers : 4
    },
    3: {
      numPlayers :2,
      numColors : 1,
      player1 : 'Joueur 1',
      player2 : 'Ordinateur',
      numHumanPlayers : 1,
      isPlayedByIa : [false,true],
      COLORS : [[1],[2]],
      PLAYERS : [
         { colors: [1],
           name: 'Joueur 1',
           number: 1,
           score: 0
         },
         { colors: [2],
           name: 'Ordinateur',
           number: 2,
           score: 0,
         } ],
      Time : 500,
      gameBoard : Shared.initGameBoard(),
      gameOver : false,
      gameState : [[false], [false]],
      history : [false, false],
      isIaPlaying : false,
      player : 0,
      restartCount : 0,
      startCell : 0
    }
  };
  for (var game in games) {
    Server.init(games, game);
  }
  t.deepEqual(games, expected);
});

test('Initialiser les données de la partie', t => {
  var games = {
    1: {
      numPlayers : 2,
      numColors : 3,
      COLORS : [[1,3,5],[2,4,6]],
      player1 : 'Marc',
      player2 : 'Joueur 2',
      PLAYERS : [],
      isPlayedByIa : [false,false],
      numHumanPlayers : 2,
      isIaPlaying : false,
      restartCount : 0
    },
    2: {
      numPlayers : 4,
      numColors : 1,
      COLORS : [[1],[2],[3],[4]],
      player1 : 'Marc',
      player2 : 'Sophie',
      player3 : 'Antoine',
      player4 : 'Luc',
      PLAYERS : [],
      isPlayedByIa : [false,false,false,false],
      numHumanPlayers : 4,
      isIaPlaying : false,
      restartCount : 0
    },
    3: {
      numPlayers : 2,
      numColors : 1,
      COLORS : [[1],[2]],
      player1 : 'Joueur 1',
      player2 : 'Ordinateur',
      PLAYERS : [],
      isPlayedByIa : [false,true],
      numHumanPlayers : 1,
      isIaPlaying : false,
      restartCount : 0
    }
  };
  var expected = {
    1: {
      numPlayers : 2,
      numColors : 3,
      player1 : 'Marc',
      player2 : 'Joueur 2',
      numHumanPlayers : 2,
      isPlayedByIa : [false,false],
      COLORS : [[1,3,5],[2,4,6]],
      PLAYERS : [
         { colors: [1,3,5],
           name: 'Marc',
           number: 1,
           score: 0
         },
         { colors: [2,4,6],
           name: 'Joueur 2',
           number: 2,
           score: 0,
         } ],
      Time : 500,
      gameBoard : Shared.initGameBoard(),
      gameOver : false,
      gameState : [[false, false, false], [false, false, false]],
      history : [false, false],
      isIaPlaying : false,
      player : 0,
      restartCount : 0,
      startCell : 0
    },
    2: {
      numPlayers : 4,
      numColors : 1,
      COLORS : [[1],[2],[3],[4]],
      player1 : 'Marc',
      player2 : 'Sophie',
      player3 : 'Antoine',
      player4 : 'Luc',
      PLAYERS : [
         { colors: [1],
           name: 'Marc',
           number: 1,
           score: 0
         },
         { colors: [2],
           name: 'Sophie',
           number: 2,
           score: 0,
         },
         { colors: [3],
           name: 'Antoine',
           number: 3,
           score: 0
         },
         { colors: [4],
           name: 'Luc',
           number: 4,
           score: 0
         }
      ],
      Time : 500,
      gameBoard : Shared.initGameBoard(),
      gameOver : false,
      gameState : [[false], [false], [false], [false]],
      history : [false, false, false, false],
      player : 0,
      restartCount : 0,
      startCell : 0,
      isIaPlaying : false,
      isPlayedByIa : [false, false, false, false],
      numHumanPlayers : 4
    },
    3: {
      numPlayers :2,
      numColors : 1,
      player1 : 'Joueur 1',
      player2 : 'Ordinateur',
      numHumanPlayers : 1,
      isPlayedByIa : [false,true],
      COLORS : [[1],[2]],
      PLAYERS : [
         { colors: [1],
           name: 'Joueur 1',
           number: 1,
           score: 0
         },
         { colors: [2],
           name: 'Ordinateur',
           number: 2,
           score: 0,
         } ],
      Time : 500,
      gameBoard : Shared.initGameBoard(),
      gameOver : false,
      gameState : [[false], [false]],
      history : [false, false],
      isIaPlaying : false,
      player : 0,
      restartCount : 0,
      startCell : 0
    }
  };
  for (var game in games) {
    Server.init(games, game);
  }
  t.deepEqual(games, expected);
});

test('Empêcher tout mouvement vers l\'arrière', t => {
  t.true(Server.isMovingBackward(1,[8,12],[7,11]));
  t.true(Server.isMovingBackward(1,[8,12],[7,13]));
  t.false(Server.isMovingBackward(1,[8,12],[8,14]));
  t.false(Server.isMovingBackward(1,[8,12],[9,13]));
  t.false(Server.isMovingBackward(1,[8,12],[9,11]));
  t.false(Server.isMovingBackward(1,[8,12],[8,10]));
  t.false(Server.isMovingBackward(2,[8,12],[7,11]));
  t.false(Server.isMovingBackward(2,[8,12],[7,13]));
  t.false(Server.isMovingBackward(2,[8,12],[8,14]));
  t.true(Server.isMovingBackward(2,[8,12],[9,13]));
  t.true(Server.isMovingBackward(2,[8,12],[9,11]));
  t.false(Server.isMovingBackward(2,[8,12],[8,10]));
  t.true(Server.isMovingBackward(3,[8,12],[7,11]));
  t.false(Server.isMovingBackward(3,[8,12],[7,13]));
  t.false(Server.isMovingBackward(3,[8,12],[8,14]));
  t.false(Server.isMovingBackward(3,[8,12],[9,13]));
  t.false(Server.isMovingBackward(3,[8,12],[9,11]));
  t.true(Server.isMovingBackward(3,[8,12],[8,10]));
  t.false(Server.isMovingBackward(4,[8,12],[7,11]));
  t.false(Server.isMovingBackward(4,[8,12],[7,13]));
  t.true(Server.isMovingBackward(4,[8,12],[8,14]));
  t.true(Server.isMovingBackward(4,[8,12],[9,13]));
  t.false(Server.isMovingBackward(4,[8,12],[9,11]));
  t.false(Server.isMovingBackward(4,[8,12],[8,10]));
  t.false(Server.isMovingBackward(5,[8,12],[7,11]));
  t.true(Server.isMovingBackward(5,[8,12],[7,13]));
  t.true(Server.isMovingBackward(5,[8,12],[8,14]));
  t.false(Server.isMovingBackward(5,[8,12],[9,13]));
  t.false(Server.isMovingBackward(5,[8,12],[9,11]));
  t.false(Server.isMovingBackward(5,[8,12],[8,10]));
  t.false(Server.isMovingBackward(6,[8,12],[7,11]));
  t.false(Server.isMovingBackward(6,[8,12],[7,13]));
  t.false(Server.isMovingBackward(6,[8,12],[8,14]));
  t.false(Server.isMovingBackward(6,[8,12],[9,13]));
  t.true(Server.isMovingBackward(6,[8,12],[9,11]));
  t.true(Server.isMovingBackward(6,[8,12],[8,10]));
});

test('Empêcher de refaire le dernier mouvement dans l\'autre sens', t => {
  var games = {
    1: {
      history : [[[10,12],[10,8]], false],
      player : 0
    }
  }
  t.true(Server.sameTraject(games,1,[[10,8],[10,12]]));
  t.false(Server.sameTraject(games,1,[[10,8],[10,10]]));
});

test('Vérifier si une case est sur le plateau de jeu', t => {
  t.true(Server.isOnGameBoard([2,12]));
  t.false(Server.isOnGameBoard([10,-1]));
});

test('Vérifier si une liste contient un certain élément', t => {
  t.true(Server.contains([1,2,3], 2));
  t.false(Server.contains(['1','2','3'], 2));
  t.true(Server.contains([[2,3],[1,5],[1,2]], [1,2]));
  t.false(Server.contains([[2,3],[3,5],[4,2]], [1,2]));
});

test('Calculer les sauts nécessaires pour relier deux cases', t => {
  var tests = {
    1: {
      start : [8,12],
      pions : [[6,12],[7,11],[7,13],[8,10],[8,14],[9,11],[9,13],[10,12]],
      cases : [[4,12],[6,14],[8,16],[10,14],[12,12],[10,10],[8,8],[6,10]],
      expected : [
        [],
        [ [ [ 8, 12 ], [ 6, 14 ] ],
          [ [ 8, 12 ], [ 6, 10 ], [ 6, 14 ] ] ],
        [ [ [ 8, 12 ], [ 8, 16 ] ] ],
        [ [ [ 8, 12 ], [ 10, 14 ] ],
          [ [ 8, 12 ], [ 10, 10 ], [ 10, 14 ] ] ],
        [],
        [ [ [ 8, 12 ], [ 10, 10 ] ],
          [ [ 8, 12 ], [ 10, 14 ], [ 10, 10 ] ] ],
        [ [ [ 8, 12 ], [ 8, 8 ] ] ],
        [ [ [ 8, 12 ], [ 6, 10 ] ],
          [ [ 8, 12 ], [ 6, 14 ], [ 6, 10 ] ] ]
      ]
    },
    2: {
      start : [8,12],
      pions : [[4,12],[6,14],[8,16],[10,14],[12,12],[10,10],[8,8],[6,10]],
      cases : [[0,12],[4,16],[8,20],[12,16],[16,12],[12,8],[8,4],[4,8]],
      expected : [
        [],
        [ [ [ 8, 12 ], [ 4, 16 ] ],
          [ [ 8, 12 ], [ 4, 8 ], [ 4, 16 ] ] ],
        [ [ [ 8, 12 ], [ 8, 20 ] ] ],
        [ [ [ 8, 12 ], [ 12, 16 ] ],
          [ [ 8, 12 ], [ 12, 8 ], [ 12, 16 ] ] ],
        [],
        [ [ [ 8, 12 ], [ 12, 8 ] ],
          [ [ 8, 12 ], [ 12, 16 ], [ 12, 8 ] ] ],
        [ [ [ 8, 12 ], [ 8, 4 ] ] ],
        [ [ [ 8, 12 ], [ 4, 8 ] ],
          [ [ 8, 12 ], [ 4, 16 ], [ 4, 8 ] ] ]
      ]
    },
    3: {
      start : [12,16],
      pions : [[8,12],[8,20],[12,8]],
      cases : [[4,8],[4,24],[12,0]],
      expected : [
        [ [ [ 12, 16 ], [ 4, 8 ] ] ],
        [ [ [ 12, 16 ], [ 4, 24 ] ] ],
        [ [ [ 12, 16 ], [ 12, 0 ] ] ]
      ]
    },
    4: {
      start : [12,16],
      pions : [[8,12],[8,20],[12,8],[5,9],[12,2],[5,23]],
      cases : [[4,8],[4,24],[12,0]],
      expected : [[],[],[]]
    },
    5: {
      start : [8,20],
      pions : [[9,17],[12,16],[10,12],[13,9]],
      cases : [[8,16]],
      expected : [[[[8, 20],[16, 12],[10, 6],[10, 18],[8, 16]]]]
    },
  };
  var coordPion, coordCase;
  var games = {};
  for (var i=1, max=Object.keys(tests).length;i<=max; i++) {
    games[i] = {
        gameBoard : [
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
        ],
        playedColor : 2,
        reachableCells : [],
        path : [],
        history : [false, false],
        player : 1
      }
    games[i]["gameBoard"][tests[i].start[0]][tests[i].start[1]] = 2; // positionne un pion
    for (var j=0; j < tests[i].pions.length; j++){ // positionne les pivots potentiels
      coordPion = tests[i].pions[j];
      games[i]["gameBoard"][coordPion[0]][coordPion[1]] = 1;
    }
    for (var k=0; k < tests[i].cases.length; k++) {
      games[i]["path"] = [];
      games[i]["reachableCells"] = [];
      coordCase = tests[i].cases[k];
      Server.getJumps(games, i, [tests[i].start], coordCase, []);
      t.deepEqual(games[i]["path"], tests[i].expected[k]);
    }
  }
});

test('Calculer le chemin pour relier deux cases', t => {
  var games = {
    1: {
      gameBoard : [
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
      ],
      playedColor : 2,
      player : 1,
      history : [false, false]
    }
  }
  var tests = {
    1: {
      start : [8,12],
      pions : [[4,12],[5,9],[6,14],[7,9],[11,11],[15,13]],
      cases : [[16,12],[7,13],[3,9]],
      expected : [
        [[8,12],[4,16],[4,8],[6,10],[8,8],[14,14],[16,12]],
        [[8,12],[7,13]],
        false
      ]
    }
    // faire d'autres tests
  };
  var coordPion, coordCase;
  for (var i=1, max=Object.keys(tests).length;i<=max; i++) {
    games[i]["gameBoard"][tests[i].start[0]][tests[i].start[1]] = 1; // positionne un pion
    for (var j=0; j < tests[i].pions.length; j++){ // positionne les pivots potentiels
      coordPion = tests[i].pions[j];
      games[i]["gameBoard"][coordPion[0]][coordPion[1]] = 2;
    }
    for (var k=0; k < tests[i].cases.length; k++) {
      games[i]["path"] = [];
      coordCase = tests[i].cases[k];
      t.deepEqual(Server.getPath(games, i, tests[i].start, coordCase), tests[i].expected[k]);
    }
  }
});

test('Vérifier si un joueur a gagné', t => {
  var games = {
    1: {
      gameBoard : winningBoard.slice(0),
      numPlayers : 6,
      numColors : 1,
      COLORS : [[1],[3],[6],[2],[4],[5]],
      gameState : [[false], [false], [false], [false], [false], [false]],
      player : 0
    },
    2: {
      gameBoard : winningBoard.slice(0),
      numPlayers : 2,
      numColors : 3,
      COLORS : [[1, 3, 5],[2, 4, 6]],
      gameState : [[true,false,true], [false,false,false]],
      player : 0
    },
    3: {
      gameBoard : winningBoard.slice(0),
      numPlayers : 2,
      numColors : 3,
      COLORS : [[1, 3, 5],[2, 4, 6]],
      gameState : [[true,false,true], [false,false,false]],
      player : 1
    },
    4: {
      gameBoard : Shared.initGameBoard(),
      numPlayers : 2,
      numColors : 3,
      COLORS : [[1, 3, 5],[2, 4, 6]],
      gameState : [[true,false,true], [false,false,false]],
      player : 0
    }
  }
  var tests = {
    1: {
      color : 1,
      expected : true
    },
    2: {
      color : 3,
      expected : true
    },
    3: {
      color : 6,
      expected : false
    },
    4: {
      color : 3,
      expected : false
    }
  }
  for (var gameId in games) {
    t.deepEqual(Server.hasWon(games, gameId, tests[gameId]["color"]), tests[gameId]["expected"]);
  }
});

test('Envoyer les scores à la BDD', t => {
  var games = {
    1: {
      PLAYERS: [{name: 'Test1', score:0},{name: 'Test2', score:1}]
    }
  };
  // https://codeutopia.net/blog/2015/01/30/how-to-unit-test-nodejs-http-requests/
  var stub = sinon.stub(http,'get');
  var expected = { hello: 'world' };
	var response = new PassThrough();
	response.write(JSON.stringify(expected));
	response.end();
  var request = new PassThrough();
	stub.callsArgWith(1,response).returns(request);
  Server.sendScore(games,1,games[1]["PLAYERS"][0], (error, result) => {
    t.deepEqual(expected, result);
  });
  t.is(stub.firstCall.args[0],'http://hop-hop-hop.herokuapp.com/score?name=Test1&score=0&adversaire1=Test2&adversaire2=undefined&adversaire3=undefined&adversaire4=undefined&adversaire5=undefined');
  expected = "some error";
  request = new PassThrough();
  stub.resetBehavior();
  stub.returns(request);
  Server.sendScore(games,1,games[1]["PLAYERS"][0], (error) => {
    t.deepEqual(error, expected);
  });
  request.emit('error', expected);
});

test('Calculer le meilleur coup à jouer', t => {
  var games = {
    1: {
      gameBoard : Shared.initGameBoard(),
      gameOver : true,
      isPlayedByIa : [true, true],
      player : 1
    },
    2: {
      gameBoard : Shared.initGameBoard(),
      gameOver : false,
      isPlayedByIa : [false, true],
      player : 0
    },
    3: {
      gameBoard : Shared.initGameBoard(),
      gameOver : false,
      isPlayedByIa : [false, true],
      player : 1,
      COLORS : [[1,3,5],[2,4,6]],
      history : [false,false],
      PLAYERS : [{score:0},{score:0}],
      Time : 500,
      numPlayers : 2,
      numColors : 3
    },
    4: {
      gameBoard : [ // plus qu'un mouvement pour gagner
            [false,false,false,false,false,false,false,false,false,false,false,false,  2  ,false,false,false,false,false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false,false,false,false,  2  ,false,  2  ,false,false,false,false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false,false,false,  2  ,false,  2  ,false,  2  ,false,false,false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false,false, -1  ,false,  2  ,false,  2  ,false,  2  ,false,false,false,false,false,false,false,false,false],
            [  4  ,false,  4  ,false,  4  ,false,  4  ,false,  2  ,false, -1  ,false, -1  ,false, -1  ,false, -1  ,false,  6  ,false,  6  ,false,  6  ,false,  6  ],
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
            [false,false,false,false,false,false,false,false,false,false,false,false,  1  ,false,false,false,false,false,false,false,false,false,false,false,false] ],
      gameOver : false,
      gameState : [[false,false,false],[false,true,true]],
      isPlayedByIa : [true, true],
      player : 1,
      COLORS : [[1,3,5],[2,4,6]],
      history : [false,false],
      PLAYERS : [{score:0},{score:0}],
      Time : 500,
      numPlayers : 2,
      numColors : 3
    }
  }
  Server.__set__('move', sinon.spy());
  Server.__set__('sendScore', sinon.spy());
  Server.makeBestMove(games,1);
  t.false(Server.__get__('move').called);
  t.false(Server.__get__('sendScore').called);
  Server.__get__('move').resetHistory();
  Server.__get__('sendScore').resetHistory();
  Server.makeBestMove(games,2);
  t.false(Server.__get__('move').called);
  t.false(Server.__get__('sendScore').called);
  Server.__get__('move').resetHistory();
  Server.__get__('sendScore').resetHistory();
  Server.makeBestMove(games,3);
  t.true(Server.__get__('move').calledOnce);
  t.false(Server.__get__('sendScore').called);
  t.is(games[3]["player"],0);
  t.is(games[3]["startCell"],0);
  t.is(games[3]["PLAYERS"][1]["score"],1);
  t.not(games[3]["history"][1],false);
  t.true(games[3]["Time"] >= 500);
  t.true(games[3]["isIaPlaying"]);
  Server.__set__('move', Server.move);
  Server.__get__('sendScore').resetHistory();
  t.true(Server.makeBestMove(games,4));
  t.true(Server.__get__('sendScore').calledOnce);
  t.true(games[4]["gameOver"]);
});

test("Vérifier la validité d'un mouvement", t => {
  var games = {
    1: {
      gameBoard : Shared.initGameBoard(),
      COLORS : [[1,3,5],[2,4,6]],
      player : 0,
      playedColor : 2,
      startCell : 0,
      history : [false, false],
      isIaPlaying : false,
      isPlayedByIa : [false,false]
    },
    2: {
      gameBoard : Shared.initGameBoard(),
      COLORS : [[1,3,5],[2,4,6]],
      player : 0,
      playedColor : 1,
      startCell : [2,14],
      history : [false, false],
      isIaPlaying : false,
      PLAYERS : [{score:0},{score:0}]
    },
    3: {
      gameBoard : Shared.initGameBoard(),
      numPlayers : 2,
      COLORS : [[1,3,5],[2,4,6]],
      player : 0,
      playedColor : 1,
      startCell : [2,14],
      history : [false, false],
      isIaPlaying : false,
      PLAYERS : [{score:0},{score:0}]
    },
    4: {
      gameBoard : winningBoard.slice(0),
      numPlayers : 2,
      COLORS : [[1,3,5],[2,4,6]],
      player : 0,
      playedColor : 1,
      startCell : 0,
      history : [false, false],
      isIaPlaying : false,
      PLAYERS : [{score:0},{score:0}],
      gameState : [[false,true,true],[false,false,false]],
      gameOver : false
    }
  }
  t.false(Server.validateMove(io, clients, games, 1, socket, [16,12])); // sélectionner pion de l'adversaire
  t.false(Server.validateMove(io, clients, games, 1, socket, [8,12])); // sélectionner case vide
  t.false(Server.validateMove(io, clients, games, 1, socket, [2,14])); // sélectionner un pion
  t.deepEqual(games[1]["startCell"],[2,14]);
  t.is(games[1]["playedColor"],1);
  t.is(games[1]["gameBoard"][2][14],-1);
  t.false(Server.validateMove(io, clients, games, 2, socket, [2,14])); // désélectionner un pion
  t.is(games[2]["startCell"],0);
  t.is(games[2]["gameBoard"][2][14],1);
  t.true(Server.validateMove(io, clients, games, 3, socket, [4,12])); // sauter
  t.is(games[3]["startCell"],0);
  t.is(games[3]["player"],1);
  t.is(games[3]["Time"],500);
  t.deepEqual(games[3]["history"],[[[2,14],[4,12]], false]);
  t.deepEqual(games[3]["PLAYERS"],[{score:1},{score:0}]);
  games[3]["player"] = 0;
  t.false(Server.validateMove(io, clients, games, 3, socket, [4,12])); // sélectionner un pion
  t.false(Server.validateMove(io, clients, games, 3, socket, [2,14])); // aller vers l'arrière
  t.true(Server.validateMove(io, clients, games, 3, socket, [4,10])); // déplacer un pion
  games[3]["player"] = 0;
  t.false(Server.validateMove(io, clients, games, 3, socket, [4,10])); // sélectionner un pion
  t.false(Server.validateMove(io, clients, games, 3, socket, [4,12])); // rejouer le dernier coup
  t.false(Server.validateMove(io, clients, games, 3, socket, [4,10])); // désélectionner un pion
  t.false(Server.validateMove(io, clients, games, 3, socket, [0,12])); // sélectionner un pion
  t.false(Server.validateMove(io, clients, games, 3, socket, [4,14])); // mouvement invalide
  t.false(Server.validateMove(io, clients, games, 3, socket, [1,13])); // case occupée
  games[4]["gameBoard"][13][9] = -1;
  games[4]["gameBoard"][12][10] = 1;
  t.false(Server.validateMove(io, clients, games, 4, socket, [12,10])); // sélectionner un pion
  t.true(Server.validateMove(io, clients, games, 4, socket, [13,9])); // remporter la partie
  t.deepEqual(games[4]["history"],[[[12,10],[13,9]],false]);
  t.is(games[4]["Time"],500);
  t.deepEqual(games[4]["PLAYERS"], [{score:1},{score:0}]);
  t.true(games[4]["gameOver"]);
  t.deepEqual(emitData, [
    ['game error', {
      message: 'please click on your own pieces',
      sound: 'fail' }],
    ['game error', {
      message: 'please click on your own pieces',
      sound: 'fail' }],
    ['select', { cell: [2,14] }],
    ['deselect', {
      cell: [2,14],
      color: 1 }],
    ['move', {
      path: [[2,14],[4,12]],
      playedColor: 1 }],
    ['new turn', { player: 1 }],
    ['select', { cell: [4,12] }],
    ['game error', {
      message: 'You can\'t go back!',
      sound: 'fail' }],
    ['move', {
      path: [[4,12],[4,10]],
      playedColor: 1 }],
    ['new turn', { player: 1 }],
    ['select', { cell: [4,10] }],
    ['game error', {
      message: 'You can\'t replay the last move',
      sound: 'fail' }],
    ['deselect', {
      cell: [4,10],
      color: 1 }],
    ['select', { cell: [0,12] }],
    ['game error', {
      message: 'Invalid move!',
      sound: 'fail' }],
    ['game error', {
      message: 'Cell not empty!',
      sound: 'fail' }],
    ['select', { cell: [12,10] }],
    ['move', {
      path: [[12,10],[13,9]],
      playedColor: 1 }],
    ['end game', {
      score: 1,
      winner: 0 }]
  ]);
});

test('Jouer un tour', t => {
  var games = {
    1: {
      gameOver: true
    },
    2: {
      isPlayedByIa: [false, false],
      player: 0,
      gameBoard: Shared.initGameBoard(),
      startCell: 0,
      COLORS: [[1],[2]]
    },
    3: {
      isPlayedByIa: [true, false],
      player: 0,
      gameBoard: Shared.initGameBoard(),
      startCell: 0,
      COLORS: [[1],[2]],
      history: [false,false],
      PLAYERS: [{score:0},{score:0}]
    },
    4: {
      isPlayedByIa: [true, true],
      player: 0,
      gameBoard: Shared.initGameBoard(),
      startCell: 0,
      COLORS: [[1],[2]],
      history: [false,false],
      PLAYERS: [{score:0},{score:0}]
    }
  }
  Server.__set__('validateMove', sinon.spy());
  Server.__set__('makeBestMove', sinon.spy());
  Server.__set__('play', sinon.spy());
  t.false(Server.play(io, clients, games, 1, socket, [2,14]));
  t.false(Server.__get__('validateMove').called);
  t.false(Server.__get__('makeBestMove').called);
  t.false(Server.__get__('play').called);
  t.false(Server.play(io, clients, games, 2, socket, [8,12]));
  t.true(Server.__get__('validateMove').calledOnce);
  t.false(Server.__get__('makeBestMove').called);
  t.false(Server.__get__('play').called);
  Server.__get__('validateMove').resetHistory();
  Server.__get__('makeBestMove').resetHistory();
  Server.__get__('play').resetHistory();
  t.true(Server.play(io, clients, games, 3));
  // clock.tick(500);
  t.false(Server.__get__('validateMove').called);
  // t.true(Server.__get__('makeBestMove').calledOnce); // impossible a tester à cause du setTimeout ?
  t.false(Server.__get__('play').called);
  t.is(games[3]["Time"],500);
  Server.__get__('validateMove').resetHistory();
  Server.__get__('makeBestMove').resetHistory();
  Server.__get__('play').resetHistory();
  t.true(Server.play(io, clients, games, 4));
  t.false(Server.__get__('validateMove').called);
  // t.true(Server.__get__('makeBestMove').calledOnce); // impossible a tester à cause du setTimeout ?
  // t.true(Server.__get__('play').calledOnce); // impossible a tester à cause du setTimeout ?
});

test('Effectuer le déplacement d\'un pion', t => {
  var games = {
    1: {
      gameBoard: Shared.initGameBoard()
    }
  }
  Server.move(games, 1, [[2,14],[4,12]], 1);
  t.is(games[1]["gameBoard"][2][14], -1);
  t.is(games[1]["gameBoard"][4][12], 1);
  Server.move(games, 1, [[0,12],[2,14],[4,16],[4,8]], 1);
  t.is(games[1]["gameBoard"][0][12], -1);
  t.is(games[1]["gameBoard"][2][14], -1);
  t.is(games[1]["gameBoard"][4][16], -1);
  t.is(games[1]["gameBoard"][4][8], 1);
});
