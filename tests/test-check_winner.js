// teste la fonction check_winner() définie dans game.js

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

function check_winner(player) {
  switch (player) {
    case 1:
      for (var R=0; R<4; R++) {
        if (M[16-R][C] != 1) return false ;
      }
      return true;
    case 2:
      for (var R=0; R<4; R++) {
        if (M[R][C] != 2)  return false ;
      }
      return true;
    case 3:
      for (var R=4; R<8; R++) {
        for (var C=R-4; C<=10-R; C+=2) {
          if (M[16-R][24-C] != 3) return false;
        }
      }
      return true;
    case 4:
      for (var R=4; R<8; R++) {
        for (var C=R-4; C<=10-R; C+=2) {
          if (M[R][C] != 4) return false;
        }
      }
      return true;
    case 5:
      for (var R=4; R<8; R++) {
        for (var C=R-4; C<=10-R; C+=2) {
          if (M[16-R][C] != 5) return false;
        }
      }
      return true;
    case 6:
      for (var R=4; R<8; R++) {
        for (var C=R-4; C<=10-R; C+=2) {
          if (M[R][24-C] != 6) return false;
        }
      }
      return true;
  }
}

for (var player=1; player<=6; player++) {
  var result = check_winner(player);
  if (result) continue;
  else console.log('ERROR: check_winner(' + player + ') is ' + result + ', should be true.');
}
