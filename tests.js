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

  game : {

    clicks : { // coordonnées des cases à cliquer
      2: { // nombre de joueurs
        1: // nombre de couleurs
          [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11]]
      }
    },

    run_test : function() {
      // ***** ENVIRONNEMENT *****
      restart();
      var clicks = Tests.game.clicks[n_player][n_color];
      // ***** TESTS *****
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

  }
};
