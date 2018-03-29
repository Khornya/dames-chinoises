var Tests = {

  check_winner : {
      /*// ***** ENVIRONNEMENT *****
      var testVars = {};
      M = [ // tous les joueurs ont gagné
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
      ]
      create_board() ;

      // ***** TESTS *****
  //      for (var player=1; player<=6; player++) {
  //        testVars.result = check_winner(player);
  //        if (testVars.result) continue;
  //        else console.log('ERROR: check_winner(' + player + ') is ' + testVars.result + ', should be true.');
  //      }
  //      break;

  // la version suivante est adaptée au code actuel multijoueur inclus
      for (var player=1; player<=n_player; player++) {
        Player=player-1;
        for (color of Colors[player-1]) {
          check_winner(color);
        }
        testVars.result = (! (isOver[player-1].includes(false)))
        if (testVars.result) continue;
        else console.log('ERROR: check_winner(' + player + ') is ' + testVars.result + ', should be true.');
      }*/
  },

  make_move : {
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
    make_move(testVars.mov_list);
    if (M !== testVars.M) console.log('ERROR: make_move(' + testVars.mov_list + ') is ' + M + ', should be ' + testVars.M);*/
  },

  restart : {

    run_test : function() {
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
      n_player = 2;
      n_color = 1;
      M = ID = Player = IsOver = Start_Cell = isOver = null;
      restart();
      var errors = false;
      if (!Tests.Assert.arraysEqual(M, test.M)) {
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
      if (!Tests.Assert.arraysEqual(Start_Cell, test.Start_Cell)) {
        console.log('Start_Cell is ', Start_Cell, ', should be ', test.Start_Cell);
        errors = true;
      }
      if (!Tests.Assert.arraysEqual(isOver, test.isOver)) {
        console.log('isOver is ', isOver, ', should be ', test.isOver);
        errors = true;
      }
      if (errors) console.log('test restart : FAIL');
      else console.log('test restart : SUCCESS');
    }

  },

  create_cell : {

    // run_test : function() {
    //   var tests = {
    //     1: {
    //       name : 'create_cell(2,10,3)',
    //       result : create_cell(2,10,3),
    //       expected : ?
    //     }
    //   }
    //   for (var i=1; i<=1; i++) {
    //     if (tests[i].result === tests[i].expected) console.log('test ' + tests[i].name + ': SUCCESS');
    //     else {
    //       console.log('test ' + tests[i].name + ': FAIL');
    //       console.log('result is ', tests[i].result, ', should be ', tests[i].expected);
    //     }
    //   }
    // }

  },

  create_board : {

    run_test : function() {

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

      for (var i=1; i<=3; i++) {
        if (i == 1) {
          console.log("test '" + tests[i].name + "' en cours." );
          console.log("Prochain test dans 5s.");
          tests[i].result = create_board(tests[i].matrice);
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
            tests[n].result = create_board(tests[n].matrice);
          }, 5000*(i-1), tests, i);
        }
      }
    }

  },

  init_matrice : {

    run_test : function() {
      var test = {
        name : "init_matrice()",
        result : init_matrice(),
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

      if (Tests.Assert.arraysEqual(test.result,test.expected)) console.log('test ' + test.name + ': SUCCESS');
      else {
        console.log('test ' + test.name + ': FAIL');
        console.log('result is ', test.result, ', should be ', test.expected);
      }
    }

  },

  initArray : {

    run_test : function() {
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

      for (var i=1; i<=5; i++) {
        if (Tests.Assert.arraysEqual(tests[i].result,tests[i].expected)) console.log('test ' + tests[i].name + ': SUCCESS');
        else {
          console.log('test ' + tests[i].name + ': FAIL');
          console.log('result is ', tests[i].result, ', should be ', tests[i].expected);
        }
      }
    }

  },

  game : {

    clicks : { // coordonnées des cases à cliquer
      2: { // nombre de joueurs
        1: // nombre de couleurs
          [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11]],
        2: [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11],[4,4],[6,6],[10,22],[10,18],[4,0],[8,16],[12,24],[12,8],[6,4],[6,8],[11,19],[7,7],[4,2],[6,4],[11,23],[9,13],[5,3],[9,15],[11,21],[11,17],[6,6],[12,24],[12,18],[10,8],[6,2],[10,14],[9,21],[5,9],[6,4],[6,16],[9,13],[9,9],[5,1],[9,21],[10,8],[6,4],[9,15],[11,21],[12,8],[6,2],[4,6],[12,18],[10,20],[4,6],[10,14],[10,22],[5,9],[5,1],[6,16],[10,20],[12,20],[12,16],[7,3],[7,5],[10,18],[10,6]]
      }
    },

    run_test : function() {
      // ***** ENVIRONNEMENT *****
      restart();
      // ***** TESTS *****
      var clicks = Tests.game.clicks[n_player][n_color];
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
      for (var i = 0; i < a.length; ++i) {
        try {
          if ((a[i].length || b[i].length) && (!Tests.Assert.arraysEqual(a[i],b[i]))) return false;
        }
        catch (e) {if (a[i] !== b[i]) return false;}
      }
      return true;
    }

  }

};
