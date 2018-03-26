// teste la fonction check_winner() définie dans game.js

// ***** ENVIRONNEMENT *****

var M = [ // tous les joueurs ont gagné
[false, false, false, false, false, false, false, false, false, false, false, false,   2  , false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false, false,   2  , false,   2  , false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false,   2  , false,   2  , false,   2  , false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false,   2  , false,   2  , false,   2  , false,   2  , false, false, false, false, false, false, false, false, false],
[  4  , false,   4  , false,   4  , false,   4  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,   6  , false,   6  , false,   6  , false,
  6  ],
[false,   4  , false,   4  , false,   4  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,   6  , false,   6  , false,   6  , false],
[false, false,   4  , false,   4  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,   6  , false,   6  , false, false],
[false, false, false,   4  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,   6  , false, false, false],
[false, false, false, false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false, false, false, false],
[false, false, false,   5  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,   3  , false, false, false],
[false, false,   5  , false,   5  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,   3  , false,   3  , false, false],
[false,   5  , false,   5  , false,   5  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,   3  , false,   3  , false,   3  , false],
[  5  , false,   5  , false,   5  , false,   5  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,  -1  , false,   3  , false,   3  , false,   3  , false,   3  ],
[false, false, false, false, false, false, false, false, false,   1  , false,   1  , false,   1  , false,   1  , false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false,   1  , false,   1  , false,   1  , false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false, false,   1  , false,   1  , false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false, false, false,   1  , false, false, false, false, false, false, false, false, false, false, false, false]
]

// ***** TESTS *****

for (var player=1; player<=6; player++) {
  var result = methods.check_winner(player);
  if (result) continue;
  else console.log('ERROR: check_winner(' + player + ') is ' + result + ', should be true.');
}
