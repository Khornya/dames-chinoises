import test from 'ava';

var Shared = require('../shared.js');

test('Initialiser un Array avec une valeur', t => {
  var tests = {
    1: {
      result : Shared.initArray(2,3,0),
      expected : [[0,0,0],[0,0,0]]
    },
    2: {
      result : Shared.initArray(4,0,false),
      expected : [false,false,false,false]
    },
    3: {
      result : Shared.initArray(2,3),
      expected : [[undefined, undefined, undefined],[undefined, undefined, undefined]]
    },
    4: {
      result : Shared.initArray(0,3,0),
      expected : []
    },
    5: {
      result : Shared.initArray(2),
      expected : [undefined, undefined]
    }
  };
  for (var test in tests) {
    t.deepEqual(test["result"], test["expected"]);
  }
});

test('Initialiser le plateau de jeu', t => {
  t.deepEqual(Shared.initGameBoard(), [
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
