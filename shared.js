(function(exports){

  /**
   * @module Shared
   */

  /**
   * @function initArray
   * @description initialise un Array de taille <i>lines</i> * <i>columns</i> avec la valeur <i>value</i>
   * <ul>
   *  <li> appelle : -
   *  <li> appelée par :
   *    <ul>
          <li> [Client.createGameBoard]{@link module:Client~createGameBoard}
          <li> [Server.restart]{@link module:Server~restart}
   *  <li> globales : -
   * @example
   * Shared.initArray(2,3,0) // -> [[0,0,0],[0,0,0]]
   * @example
   * Shared.initArray(4,0,false) // -> [false,false,false,false]
   * @return {Array}
   * @param {int} lines - le nombre de lignes
   * @param {int} [columns=0] - le nombre de colonnes
   * @param {*} [value] - la valeur à affecter à chaque élément
   */
  function initArray(lines, columns, value) {
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

  /**
   * @function initGameBoard
   * @description initialise la matrice 17*25 pour le plateau de jeu :
   * <img src='./images/gameBoard.png'>
   * <ul>
   *  <li> appelle : [Shared.initArray]{@link module:Shared~initArray}
   *  <li> appelée par : [Server.restart]{@link module:Server~restart}
   *  <li> globales : -
   * @example
   * Shared.initGameBoard() // -> [
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
   * @return {Array}
   */
  function initGameBoard() {
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
