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
            expected : true
          },
          3: {
            history : [[8,12],[4,16]],
            traject : [[16,12],[14,14]],
            expected : false
          }
        };
        var result;
        for (var i=1, max=Object.keys(tests).length;i<=max; i++) {
          Player = 0;
          History[Player] = tests[i].history;
          result = sameTraject(tests[i].traject);
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
