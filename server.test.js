import test from 'ava';

var Server = require('./server.js'); // le fichier contenant les fonctions à tester

var emptyBoard = [
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

function emit(message,data) {
    lastMessage = message;
    lastData = data;
    messages.push(message);
}

var messages = [];
var lastMessage;
var lastData;
var socket = { // pour contourner les méthodes réseau
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
function setTimeout(f,t) { // pour ne pas attendre
f();
}

test('Echapper les caractères HTML', t => {
  t.is(Server.escapeHtml('<script>'),'&lt;script&gt;');
});

test('Initialiser le plateau de jeu', t => {
  t.deepEqual(Server.initGameBoard(), [
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
  ]);
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
      gameBoard : Server.initGameBoard(),
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
      gameBoard : Server.initGameBoard(),
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
      gameBoard : Server.initGameBoard(),
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
      gameBoard : Server.initGameBoard(),
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
      gameBoard : Server.initGameBoard(),
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
      gameBoard : Server.initGameBoard(),
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

test.skip('Calculer les sauts nécessaires pour relier deux cases', t => {
  var tests = {
    1: {
      start : [8,12],
      pions : [[6,12],[7,11],[7,13],[8,10],[8,14],[9,11],[9,13],[10,12]],
      cases : [[4,12],[6,14],[8,16],[10,14],[12,12],[10,10],[8,8],[6,10]],
      expected : [
        [],
        [ [ [ 8, 12 ], [ 6, 14 ] ],
          [ [ 8, 12 ], [ 6, 10 ], [ 6, 14 ] ] ],
        [ [ [ 8, 12 ], [ 8, 16 ] ] ] // a continuer
      ]
    },
    2: {
      start : [8,12],
      pions : [[4,12],[6,14],[8,16],[10,14],[12,12],[10,10],[8,8],[6,10]],
      cases : [[0,12],[4,16],[8,20],[12,16],[16,12],[12,8],[8,4],[4,8]],
      expected : [[], [[[8,12],[4,16]]], [[[8,12],[8,20]]], [[[8,12],[12,16]]], [], [[[8,12],[12,8]]], [[[8,12],[8,4]]], [[[8,12],[4,8]]]]
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
      expected : [[],[],[]]
    },
    5: {
      start : [8,20],
      pions : [[9,17],[12,16],[10,12],[13,9]],
      cases : [[8,16]],
      expected : [[[8, 20],[16, 12],[10, 6],[10, 18],[8, 16]]]
    },
  };
  var coordPion, coordCase;
  var games = {};
  for (var i=1, max=Object.keys(tests).length;i<=max; i++) {
    games = {
      1: {
        gameBoard : emptyBoard,
        playedColor : 2,
        reachableCells : [],
        path : [],
        history : [false, false],
        player : 1
      }
    }
    games[1]["gameBoard"][tests[i].start[0]][tests[i].start[1]] = 2; // positionne un pion
    for (var j=0; j < tests[i].pions.length; j++){ // positionne les pivots potentiels
      coordPion = tests[i].pions[j];
      games[1]["gameBoard"][coordPion[0]][coordPion[1]] = 1;
    }
    for (var k=0; k < tests[i].cases.length; k++) {
      games[1]["path"] = [];
      games[1]["reachableCells"] = [];
      coordCase = tests[i].cases[k];
      Server.getJumps(games, 1, [tests[i].start], coordCase, []);
      console.log(i, tests[i].start, coordCase); console.log("path :",games[1]["path"]); console.log("expected :", tests[i].expected[k]);
      t.deepEqual(games[1]["path"], tests[i].expected[k]);
    }
  }
});

test.skip('Calculer le chemin pour relier deux cases', t => {
  var games = {
    1: {
      gameBoard : emptyBoard,
      playedColor : 1,
      player : 0,
      history : [false, false]
    }
  }
  var tests = {
    1: {
      start : [8,12],
      pions : [[4,12],[5,9],[6,14],[7,9],[11,11],[15,13]],
      cases : [[16,12],[7,13],[3,9]],
      expected : [[[[8,12],[4,16],[4,8],[6,10],[8,8],[14,14],[16,12]]],[[[8,12],[7,13]]],[]]
    }
  };
  var coordPion, coordCase;
  for (var i=1, max=Object.keys(tests).length;i<=max; i++) {
    games[1]["gameBoard"][tests[i].start[0]][tests[i].start[1]] = 1; // positionne un pion
    for (var j=0; j < tests[i].pions.length; j++){ // positionne les pivots potentiels
      coordPion = tests[i].pions[j];
      games[1]["gameBoard"][coordPion[0]][coordPion[1]] = 2;
    }
    for (var k=0; k < tests[i].cases.length; k++) {
      games[1]["path"] = [];
      coordCase = tests[i].cases[k];
      Server.getPath(games, 1, tests[i].start, coordCase);
      // console.log(games[1]["path"]);
      t.deepEqual(games[1]["path"], tests[i].expected[k]);
    }
  }
});

test('Vérifier si un joueur a gagné', t => {
  var games = {
    1: {
      gameBoard : winningBoard,
      numPlayers : 6,
      numColors : 1,
      COLORS : [[1],[3],[6],[2],[4],[5]],
      gameState : [[false], [false], [false], [false], [false], [false]],
      player : 0
    },
    2: {
      gameBoard : winningBoard,
      numPlayers : 2,
      numColors : 3,
      COLORS : [[1, 3, 5],[2, 4, 6]],
      gameState : [[true,false,true], [false,false,false]],
      player : 0
    },
    3: {
      gameBoard : winningBoard,
      numPlayers : 2,
      numColors : 3,
      COLORS : [[1, 3, 5],[2, 4, 6]],
      gameState : [[true,false,true], [false,false,false]],
      player : 1
    },
    4: {
      gameBoard : Server.initGameBoard(),
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

test('Initialiser un Array avec une valeur', t => {
  var tests = {
    1: {
      result : Server.initArray(2,3,0),
      expected : [[0,0,0],[0,0,0]]
    },
    2: {
      result : Server.initArray(4,0,false),
      expected : [false,false,false,false]
    },
    3: {
      result : Server.initArray(2,3),
      expected : [[undefined, undefined, undefined],[undefined, undefined, undefined]]
    },
    4: {
      result : Server.initArray(0,3,0),
      expected : []
    },
    5: {
      result : Server.initArray(2),
      expected : [undefined, undefined]
    }
  };
  for (var test in tests) {
    t.deepEqual(test["result"], test["expected"]);
  }
});

test.todo('envoyer les scores à la BDD');
test.todo('Calculer le meilleur coup à jouer');

test("Vérifier la validité d'un mouvement", t => {
  var games = {
    1: {
      gameBoard : Server.initGameBoard(),
      COLORS : [[1,3,5],[2,4,6]],
      player : 0,
      playedColor : 2,
      startCell : 0,
      history : [false, false],
      isIaPlaying : false,
      isPlayedByIa : [false,false]
    },
    2: {
      gameBoard : Server.initGameBoard(),
      COLORS : [[1,3,5],[2,4,6]],
      player : 0,
      playedColor : 1,
      startCell : [2,14],
      history : [false, false],
      isIaPlaying : false,
      PLAYERS : [{score:0},{score:0}]
    },
    3: {
      gameBoard : Server.initGameBoard(),
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
      gameBoard : winningBoard,
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
  t.is(lastData["message"], 'please click on your own pieces');
  t.false(Server.validateMove(io, clients, games, 1, socket, [8,12])); // sélectionner case vide
  t.is(lastData["message"], 'please click on your own pieces');
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
  t.deepEqual(games[3]["history"],[[[2,14],[4,12]], false]);
  t.deepEqual(games[3]["PLAYERS"],[{score:1},{score:0}]);
  // TODO : check side effects
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
  t.deepEqual(messages, ['game error','game error', 'select', 'deselect', 'move', 'new turn', 'select', 'game error', 'move', 'new turn', 'select', 'game error', 'deselect', 'select', 'game error', 'game error', 'select', 'move', 'end game']);
});

test.todo('Jouer un tour');
test.todo('Effectuer le déplacement d\'un pion');
