(function(exports){

  function initArray(lines, columns, value) { // fonction qui initialise un array de taille lines * columns avec la valeur value
    var array = [];
    for (var i=0; i<lines; i++) {
      if (columns) {
        array[i] = [];
        for (var j=0; j<columns; j++) {
          array[i][j] = value;
        }
      }
      else array[i] = value;
    }
    return array;
  }

  function initGameBoard() { // initialise la matrice pour le plateau de jeu
    var matrice = initArray(17,25,false);
    for (var row=0; row<4; row++) {
      for (var col=12-row; col<=12+row; col+=2) {
        matrice[row][col] = 1;
        matrice[16-row][col] = 2;
      }
    }
    for (var row=4; row<8; row++) {
      for (var col=12-row; col<=12+row; col+=2) {
        matrice[row][col] = -1;
        matrice[16-row][col] = -1;
      }
      for (var col=row-4; col<=10-row; col+=2) {
        matrice[row][col] = 3;
        matrice[16-row][24-col] = 4;
        matrice[row][24-col] = 5;;
        matrice[16-row][col] = 6;
      }
    }
    for (var col=4; col<21; col+=2) { matrice[8][col] = -1 }
    return matrice;
  }

  exports.initArray = initArray;
  exports.initGameBoard = initGameBoard;

}(typeof exports === 'undefined' ? this.Shared = {} : exports));
