///(function() { // IIFE pour éviter les variables globales
  var test = false; // true pour lancer un test
  var testType = 'game';


  // ********************************** configuration nombre de joueur nombre de couleur (à récupérer via PHP) ***************************

  var n_player = parseInt(document.getElementById("nombre_joueurs").value,10);   // si n_player=2, il faut définir n_color (1, 2 ou 3) sinon n_color= 2 pour 3 joueurs et 1 pour (4,6) joueur (par defaut)
  var n_color = parseInt(document.getElementById("colors").value,10);

  var Colors = { // attribution des couleurs à chaque joueur
    2: {
      1: [[1],[2]],
      2: [[1,3],[2,4]],
      3: [[1,3,5],[2,4,6]]
    },
    3: { 2: [[1,3],[4,5],[2,6]] },
    4: { 1: [[1],[2],[3],[4]] },
    6: { 1: [[1],[3],[6],[2],[4],[5]] }
  }[n_player][n_color];


  // ******************************************* création du plateau de jeu ****************************************

  var Player;  // joueur symbolique
  var IsOver; // partie terminée ?
  var Start_Cell; // case départ pour un mouvement // pas de couples en JS
  var Color; // couleur jouée
  var isOver; // matrice pour les couleurs finies
  var M; // matrice pour le plateau
  var ID; // matrice pour les images
  var History; // liste qui sauvgarde pour chaque joueur le dernier chemin empreinté
  var Liste = [] ; //liste utilisé par l'IA
  var players = [];
  var Time=500;
  var IA;


  var coordTriangles = [
   [[0,12],[1,11],[1,13],[2,10],[2,12],[2,14],[3,9],[3,11],[3,13],[3,15]],
   [[16,12],[15,11],[15,13],[14,10],[14,12],[14,14],[13,9],[13,11],[13,13],[13,15]],
   [[4,0],[4,2],[4,4],[4,6],[5,1],[5,3],[5,5],[6,2],[6,4],[7,3]],
   [[12,24],[12,22],[12,20],[12,18],[11,23],[11,21],[11,19],[10,22],[10,20],[9,21]],
   [[4,24],[4,22],[4,20],[4,18],[5,23],[5,21],[5,19],[6,22],[6,20],[7,21]],
   [[12,0],[12,2],[12,4],[12,6],[11,1],[11,3],[11,5],[10,2],[10,4],[9,3]]
  ];

  var Sounds = {
    jump : new sound("sounds/click.mp3"),
    fail : new sound("sounds/fail.mp3"),
    win : new sound("sounds/win.mp3")
  }

  var Muted = false; // etat du son

  document.getElementById("muteButton").addEventListener('click', function(e) {
    Muted = !Muted;
    e.currentTarget.src = Muted? "images/mute.png" : "images/unmute.png";
  });

  // ************************************************** tests automatisés *************************************************

  if (test) {
    Tests[testType].run_test();
  }
  else {
    init();
  }

  // *********************************************** fonctions de jeu ************************************************

  // initialise la matrice pour le plateau de jeu
  function init_matrice() {
    var matrice = initArray(17,25,false);
    for (var R=0; R<4; R++) { // R pour row, C pour column
      for (var C=12-R; C<=12+R; C+=2) {
        matrice[R][C] = 1;
        matrice[16-R][C] = 2;
      }
    }
    for (var R=4; R<8; R++) {
      for (var C=12-R; C<=12+R; C+=2) {
        matrice[R][C] = -1;
        matrice[16-R][C] = -1;
      }
      for (var C=R-4; C<=10-R; C+=2) {
        matrice[R][C] = 3;
        matrice[16-R][24-C] = 4;
        matrice[R][24-C] = 5;;
        matrice[16-R][C] = 6;
      }
    }
    for (var C=4; C<21; C+=2) { matrice[8][C] = -1 }
    return matrice;
  }

  // crée le plateau de jeu
  function create_board(matrice) {
    var board = initArray(17,25,false);
    var line, cell;
    for (var R=0; R<17; R++) { // crée un div pour chaque ligne
      line = document.createElement('div');
      line.id = 'line'+R;
      line.className = 'line';
      document.getElementById('board').appendChild(line);
      for (var C=0; C<25; C++) { // crée un div pour chaque cellule
        if (matrice[R][C] !== false) {
          cell = create_cell(R, C, matrice[R][C]);
          line.appendChild(cell);
          board[R][C] = cell.firstChild; // identité de chaque image
        }
      }
    }
    return board;
  }

  // crée une case
  function create_cell(R, C, color) {
    var cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('line', R);
    cell.setAttribute('column', C);
    // ajoute l'image de base pour la case
    cell.innerHTML = "<img alt='pion' src='images/pion" + color + ".png' />";
    // gère l'event 'click'
    cell.addEventListener('click', play);
    return cell;
  }

  // fonction pour recommencer le jeu
  function init() {
    M = init_matrice();
    ID = create_board(M);
    IA = initArray(n_player, 0, false);
    for (var i=1; i<=n_player; i++) {
      if (document.getElementById("IA"+i).value!== "")
        IA[i-1] = true;
    }
    for (var n=1; n<=n_player; n++) {
      if (IA[n-1]) players.push(new player(document.getElementById("IA"+n).value,0,Colors[n-1], n));
      else players.push(new player(document.getElementById("player"+n).value,0,Colors[n-1], n));
    }
    for (var i=0, max=players.length; i<max; i++) {
      players[i].createFrame();
    }
    restart(0);

  }
  

  function restart(opt=1) { 
    if (opt) {
      document.getElementById('myModal').style.display = "none";
      M = init_matrice();
      refresh_board(M);
      for(var n=0; n< n_player; n++) 
        players[n].score = 0;
    }
    Player=0;
    Start_Cell =  (0,0) ;
    IsOver = false;
    isOver = initArray(n_player, n_color, false);
    History = initArray(n_player, 0, false);
    update_player_frames();
    if (IA[Player]) play();
 }


  function refresh_board(M) { // a optimiser pour ne pas tester les cases en dehros de l'étoile
    for (var R=0; R<17; R++) {
      for (var C=0; C<25; C++) {
        if (ID[R][C].src !== "images/pion" + M[R][C] + ".png")
          ID[R][C].src = "images/pion" + M[R][C] + ".png"; }
    }
  }

  function validate_movement(cell) {
    var R = parseInt(cell.getAttribute('line'),10);
    var C = parseInt(cell.getAttribute('column'),10);
    if (Start_Cell === (0,0)) {                                     // premier click
      if (!(Colors[Player].includes(M[R][C]))) {                    // vérifie qu'on click sur le pion du joueur qui a la main
        if (!IA[Player]) send_msg("please click on your own pieces", Sounds.fail);
        else send_msg("please wait until computer finish playing ", Sounds.fail);
        return false;
      }
      Start_Cell = [R,C];
      ID[R][C].src = "images/pion" + M[R][C] + "vide.png";
      Color = M[R][C]
      M[R][C] = -1;
      return false;                                               // marquer la case depart vide pour ne pas l'utiliser comme pivot dans get_jump()
    }
    else {
      if (Start_Cell[0] === R && Start_Cell[1] === C) {            // retour à la case départ annule le mouvement
        M[R][C] = Color;
        Start_Cell = (0,0);
        ID[R][C].src = "images/pion" + Color + ".png";
        return false;
      }
      if (M[R][C] !== -1) {                                        // cell not empty
        send_msg("Cell not empty!", Sounds.fail); return false;
      }

      if (go_outside(Color,Start_Cell, [R, C])) {                  // mouvement illégal vers l'extérieur du triangle opposé
        send_msg("You can't move this piece outside!", Sounds.fail);
        return false;
      }

      if (go_back(Color, Start_Cell[0], Start_Cell[1], R, C)) {    // mouvement illégal en réculant
        send_msg("You can't go back!", Sounds.fail); return false;
      }


      if (!(traject = get_traject(Start_Cell, R, C))) {            // mouvement invalide
        send_msg("Invalide Move!", Sounds.fail);
        return false;
      }
      if (sameTraject(traject)) {
        send_msg("You can't replay the last move", Sounds.fail);
        return false;
      }
      History[Player] = traject;
      Time = 500*(traject.length-1)
      make_move(traject);
      return true;
    }
  }

  function go_back(color,R,C,R1,C1) {
    if (color===1)  return R1-R < 0;
    if (color===2)  return R1-R > 0;
    if (color===3) return C1+R1-C-R <0;
    if (color===4) return C1+R1-C-R >0;
    if (color===5) return C1-R1-C+R >0;
    if (color===6) return C1-R1-C+R <0;
  }
  // en réfléchissant je pense que c'est un test redanadant de la fonction précédente;
  //car une fois dans le triangle opposé on peut pas de toute facon reculer y compris sortir
  function go_outside(color, start, cell) {
    var n =  (color%2 ? color : color-2);
    return (contains(coordTriangles[n], start) &&
           (! contains(coordTriangles[n],cell)))
  }

  function sameTraject(traject) {
    var i, j;
    i =traject.length;
    j= i-1
    last = History[Player];
    if (i !== last.length) return false;
    while (i--) {
      if (traject[j-i][0] !== last[i][0] ||
         traject[j-i][1] !== last[i][1])
         return false;
     }
     return true;
  }

  function get_traject(start, R1, C1) {
    Liste = [];                                  // init Liste
    var R = start[0]; var C = start[1];
    var i, j;
    for (i =R-1; i <= R+1; i++)  {               // add mouvement adjaçant
      for (j=C-2; j<= C+2; j++) {
         if ((i!=R || j!=C) && in_board(i,j) && M[i][j]== -1){
           if(! go_back(Color, R, C, i, j) &&
                 ! sameTraject([start, [i,j]]))
              Liste.push([i,j]);                    // used by IA
           if (i==R1 && j==C1) return [start,[i,j]];
         }
      }
    }
    return get_jump([start], R1,C1) ;
  }



  function get_jump(liste , R1, C1, traject=[]) {
    if (liste.length<1) return false;
    var i, j, k;
    var pivot_r , pivot_c;
    var n, index;
    var access_cell = []
    var R = liste[0][0]; var C = liste[0][1];

    // chercher saut sur ligne + diagonal 6 directions :
    for (i=-1; i<2; i++) {     // i in [-1, 0, 1]
      for (j=-1; j<2; j+=2) {  // j in [-1, 1]
        pivot_r = R+i;
        pivot_c = C+j;
        while (in_board(pivot_r, pivot_c) && M[pivot_r][pivot_c] < 1) { // avancer jusqu'a case occupée
          pivot_r += i;
          pivot_c += j;
        }
        n=0;
        for (k=1; k< j*(pivot_c-C); k+=1) {
          if (!in_board(pivot_r+i*k, pivot_c+j*k)) break;
          if (M[pivot_r+i*k][pivot_c+j*k] > 0) n+=1; // si un autre pion sur le chemin break
        }
        if (n===0) {
          index_r = 2*pivot_r-R;   //(quand i=0; , pivot_r=R ; 2*R-R=R (on reste sur la même la ligne)
          index_c = 2*pivot_c-C;
          if (contains(traject,[index_r, index_c])) continue ; // éviter de tourner rond
          if (in_board(index_r, index_c) && M[index_r][index_c] === -1) { // si la case en asymétrie est vide valide:
            if(! go_back(Color, R, C, index_r, index_c) &&
                 ! sameTraject(traject.concat([[R,C], [index_r, index_c]])))
              Liste.push([index_r, index_c])
            if (index_r==R1 && index_c==C1) return traject.concat([[R,C], [index_r, index_c]]);
            else access_cell.push([index_r, index_c]);
          }
        }
      }
    }
    return (get_jump(liste.slice(1), R1, C1, traject) ||
            get_jump(access_cell, R1, C1, traject.concat([liste[0]])));
  }


  function ordi_player() {
    if (!IA[Player]) return;
    if (IsOver) return;       // Isover
    var i, j, k;             // var pour itération
    var weight=-99, selected; // meilleur poid et chemin depart arrivé correspondant
    var x, y, x0, y0, w=0, n;
    var a , b, p, p0;         // géomitrie
    var s=0;                  // pour avoir une idée sur le nombre d'itération
    for( i = 0; i<17; i++) {  // parcourt du plateau
      for (j=0 ; j<25; j++) {
        if(Colors[Player].includes(M[i][j])) {       // si pion de l'IA
          Color=M[i][j];                        // fait semblant qu'on va le déplacer
          M[i][j]=-1;                           //  (i, j) cellule depart
          get_traject([i,j], -1, -1);           // set in Liste all reachable cell
          M[i][j]=Color;                        // rétablir la valeur initiale

          for(k=0; k< Liste.length; k++){       // set weight // compare  (pour toute cellule accesible accorde un poid
            n =  (Color%2 ? Color : Color-2);
            x0= coordTriangles[n][0][0] ;y0= coordTriangles[n][0][1]  // (x0, y0) pointe du triangle opposé // on souhaite diminuer au max la distance
            a = (Color%2 ? 1: -1) ;               // dans quelle direction vont les x? selon les couleur (1, 3, 5 direction +1, 2, 4, 6 direction -1
            b = (Color%3 ? (Color<3 ? 0 : -1) : 1); // dans quelle direction vont les y? selon les couleur (1, 2:aucun effet 3,6: +1 4, 5:-1
            p = -3*a*b;                            // ce code trouve l'equation de la droite allant de la pointe du home a la pointe de l'opposé
            p0 = -p*8-12;
            s+=1
            x = Liste[k][0];  y = Liste[k][1];  // (x, y) cellule accesible a partir de (i, j)
            w  = 10* (a*(x-i)+b*(y-j));                                // main direction, selon les option a, et b
            w += 10* (Math.pow((i-x0), 2) + Math.pow((j-y0), 2)/3);    // max distance from depart
            w -= 10* (Math.pow((x-x0), 2) + Math.pow((y-y0), 2)/3);    // min distance de la case accesible à la pointe (ds le meilleur cas val=0
            // le code suivant pour rester sur la ligne droite entre le home et l'oppossé
            w += 15* (Math.pow(p*i+j+p0, 2)/(Math.pow(p, 2)+3));    // privilégier le spions les plus éloignés
            w -= 15* (Math.pow(p*x+y+p0, 2)/(Math.pow(p, 2)+3));    // privilégier les positions les plus proches
            if (w > weight) {                                                      // compare
              weight =w;
              selected = [[i, j], x, y];
            }
          }
        }
      }
    }
    Color = M[selected[0][0]][selected[0][1]];                                    // ici on valide le meilleur choix
    console.log(s + " scénario evaluated");
    M[selected[0][0]][selected[0][1]]=-1;
    traject = get_traject(selected[0], selected[1], selected[2]);
    History[Player] = traject;
    Time += 500*(traject.length)
    setTimeout(function(){ make_move(traject);}, 500);

  }

  function make_move(mov_list) {
    var previous = mov_list[0];
    var actuel = mov_list[1];
    M[previous[0]][previous[1]] = -1;
    M[actuel[0]][actuel[1]] = Color;
    ID[previous[0]][previous[1]].src = "images/pion-1.png";
    ID[actuel[0]][actuel[1]].src = "images/pion" + Color + ".png";
    Sounds.jump.play();
    if (mov_list.length > 2) {
      (function(mov_list) {
        setTimeout(function(){
          make_move(mov_list);
        }, 500*(!test)); // temps d'exécution réduit pour les tests
      })(mov_list.slice(1));
    }
    else {
      players[Player].updateScore();
      if (check_winner(Color)) {
        IsOver = true;
        end_game();
        push_score(players[Player]);
      }
      Player = (Player+1) % n_player;
      Start_Cell = (0,0);
      update_player_frames();
    }
  }

  function check_winner(color) {
    var R, C;
    var n =  (color%2 ? color : color-2);
    for (var i=0; i<10; i++) {
      R = coordTriangles[n][i][0];
      C = coordTriangles[n][i][1]
      if (M[R][C] != color) return false ;
    }
    for (n=0; n< Colors[Player].length; n++) {
      if (Colors[Player][n] === color)
        isOver[Player][n]=true;
    }
    return (! (isOver[Player].includes(false)))
  }

function end_game() {
        var modal = document.getElementById('myModal');
        var btn = document.getElementById("myBtn"); // Get the button that opens the modal 
        var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
        var content = document.getElementById("modal_text");
        modal.style.display = "block";
        Sounds.win.play();
        content.innerHTML = players[Player].name + " a gagné en " + players[Player].score + " coups." ;
        span.onclick = function() {                // When the user clicks on <span> (x), close the modal
            modal.style.display = "none";
        }
        window.onclick = function(event) {         // When the user clicks anywhere outside of the modal, close it
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }  
}


  // constructeur pour la classe Player
  function player(name, score, colors, number, frame) {
      this.name = name;
      this.score = score;
      this.colors = colors;
      this.number = number;
      this.frame = frame;

      this.updateScore = function() {
        this.score += 1;
  //      this.frame.children[1].innerHTML = ('score : ' + this.score);
      };

      this.createFrame = function() {  // crée un cadre pour les infos d'un joueur
          var frame = document.createElement('div');
          frame.className = 'player_info';
          frame.id = 'player' + this.number;
          var name = document.createElement('p');
          name.className = 'player_name';
          name.innerHTML = this.name;
          var score = document.createElement('p');
          score.className = 'player_score';
          score.innerHTML = ('score : ' + this.score);
          var colors = document.createElement('span');
          colors.className = 'player_colors';
          var code = '';
          for (var i=0, max=this.colors.length, color; i<max; i++) {
            color = this.colors[i];
             code += "<img class='imagetag' alt='color' src='images/pion" + color + ".png' />"
          }
          colors.innerHTML = code;
          frame.appendChild(name);
  //        frame.appendChild(score);
          frame.appendChild(colors);
          document.getElementById('left_panel').appendChild(frame);
          this.frame = frame;
        };
    }


 // se déclenche à chaque clic sur une case du plateau // ou automatiquement si IA
function play(event) {
    if (IsOver) return;
    if (!IA[Player])
      if (! validate_movement(event.currentTarget)) return ;
    setTimeout(function(){ ordi_player();}, Time);   //Time pour attendre
    if (IA[(Player+1)%2]) setTimeout(function(){ play();}, Time);
    Time=500;
}
  function in_board(x,y) {
    return (x > -1 && x < 17 && y > -1 && y<25);
  }

  function update_player_frames() {
    var player_frames = document.querySelectorAll('.player_info');
    for (var i=0, max=player_frames.length; i<max; i++) {
      if (player_frames[i].id === 'player' + (Player+1)) {
        player_frames[i].firstChild.style.textDecoration = 'underline';
      }
      else {
        player_frames[i].firstChild.style.textDecoration = 'none';
      }
    }
  }

  function send_msg(msg, sound) {
    sound.play();
    alert(msg);
  }

  function contains(liste, obj) {
    var i = liste.length;
    while (i--) {
      if (liste[i][0]==obj[0] && liste[i][1] == obj[1]) {
        return true;
      }
    }
    return false;
  }

  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      if (!Muted) this.sound.play();
    }
  }

  function initArray(lignes, colonnes, valeur) {
    var array = [];
    for (var i=0; i<lignes; i++) {
      if (colonnes) {
        array[i] = [];
        for (var j=0; j<colonnes; j++) {
          array[i][j] = valeur;
        }
      }
      else array[i] = valeur;
    }
    return array;
  }

  function push_score(player) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
           if (this.readyState == 4) {
             if (this.status == 200) {
             }
             else {
               alert("Les scores n'ont pas pu être envoyés à la base de données");
             }
           }
        };
      var name = encodeURIComponent(player.name);
      var score = encodeURIComponent(player.score);
      var adversaires = players.filter(item => item !== player);
      adversaires.forEach(function(value, index, array) {
        array[index] = encodeURIComponent(value.name);
      })
      xhr.open('GET', 'score.php?name=' + name + '&score=' + score + '&adversaire1=' + adversaires[0] + '&adversaire2=' + adversaires[1] + '&adversaire3=' + adversaires[2] + '&adversaire4=' + adversaires[3] + '&adversaire5=' + adversaires[4]);
      xhr.send(null);
    }
//})();
