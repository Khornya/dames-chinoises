<!-- pour la gestion des sessions plus tard -->
<?php
session_start();
?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="style.css" />
    <title>Hop hop hop</title>
  </head>
  <body>
    <header>
      <?php include 'header.html';?>
    </header>
    <div id="main_wrapper">
      <section>
        <h1>Bienvenue sur HOP HOP HOP !</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo odio non consectetur porta. Quisque iaculis nec augue a facilisis. Duis mollis nulla odio, non convallis purus commodo ac. Sed in.</p>
      </section>
      <section>
        <h1>Les dames chinoises</h1>
          <p>
          Les dames chinoises sont un jeu de société se jouant sur un tablier (jeu) généralement circulaire ou hexagonal, sur lequel une étoile à six branches est représentée, comportant 121 emplacements au total.
          </p>
          <div id="seemore">
            orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo odio non consectetur porta. Quisque iaculis nec augue a facilisis. Duis mollis nulla odio, non convallis purus commodo ac. Sed in. orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo odio non consectetur porta. Quisque iaculis nec augue a facilisis. Duis mollis nulla odio, non convallis purus commodo ac. Sed in.
          </div>
          <button id="voirPlus" onclick="seemore()">Voir plus</button>
      </section>
      <div id="test">
          <section id="game">
            <h1>Jouer une partie</h1>
            <form action="game.php" target="_self" method="POST">
              <select id="mode" name="nombre_joueurs" onclick="updateChoices()">
                <option value="1">1 player vs CPU</option>
                <option value="2">2 players</option>
                <option value="3">3 players</option>
                <option value="4">4 players</option>
                <option value="6">6 players</option>
              </select>
              <br />
              <div>
                <input type="text" name="player1" id="player1" placeholder="NAME PLAYER 1"/><span id="player1colors"></span>
              </div>
              <div>
                <input type="hidden" name="player2" id="player2" placeholder="NAME PLAYER 2"/><span id="player2colors"></span>
              </div>
              <div>
                <input type="hidden" name="player3" id="player3" placeholder="NAME PLAYER 3"/><span id="player3colors"></span>
              </div>
              <div>
                <input type="hidden" name="player4" id="player4" placeholder="NAME PLAYER 4"/><span id="player4colors"></span>
              </div>
              <div>
                <input type="hidden" name="player5" id="player5" placeholder="NAME PLAYER 5"/><span id="player5colors"></span>
              </div>
              <div>
                <input type="hidden" name="player6" id="player6" placeholder="NAME PLAYER 6"/><span id="player6colors"></span>
              </div>
              <span id="color_choice">
                Nombre de couleurs :
                <input type="radio" name="colors" value="1" id="1" onclick="updateColors()" checked />
                <label for="1" onclick="updateColors()">1</label>
                <input type="radio" name="colors" value="2" id="2" onclick="updateColors()" />
                <label for="2" onclick="updateColors()">2</label>
                <input type="radio" name="colors" value="3" id="3" onclick="updateColors()" />
                <label for="3" onclick="updateColors()">3</label>
                <br/>
              </span>
              <input type="submit" name="PLAY" value="PLAY"/>
            </form>
          </section>
          <table id="score">
          <th colspan="2" align="center"><h1>Meilleurs scores</h1></th>
          <?php
            try
            {
              $bdd = new PDO('mysql:host=localhost;dbname=dames_chinoises;charset=utf8', 'root', 'root');
            }
              catch(Exception $e)
            {
              die('Erreur : '.$e->getMessage());
            }
            $reponse = $bdd->query('SELECT nom, score FROM scores ORDER BY score DESC LIMIT 0, 3');
            while ($donnees = $reponse->fetch())
            {
              echo "<tr>";
              echo "<td>",$donnees['nom'],"</td>";
              echo "<td>",$donnees['score'],"</td>";
              echo "</tr>";
            }
            $reponse->closeCursor();
          ?>
          </table>

      </div>
      <footer clear:both>
        <a href="mailto:contact@hophophop.fr">Nous contacter</a>
      </footer>
    </div>
  <script>
    updateColors();

    function seemore() {
      var x = document.getElementById("seemore");
      var y = document.getElementById("voirPlus");
      if (x.style.display === "none") {  /* get computedStyle */
          x.style.display = "block";
          y.innerHTML = "Voir moins";
      }
      else {
          x.style.display = "none";
          y.innerHTML = "Voir plus";
      }
    }

    function updateChoices() {
      var colorChoices = {
        1: { display: '', default: 1 },
        2: { display: '', default: 1 },
        3: { display: 'none', default: 2 },
        4: { display: 'none', default: 1 },
        6: { display: 'none', default: 1 }
      };
      for (var i = 1; i <= 6; i++) {
        document.getElementById("player"+i).type = 'hidden';
      }
      var e = document.getElementById("mode");
      var mode = e.options[e.selectedIndex].value;
      document.getElementById("color_choice").style = "display:" + colorChoices[mode]['display'];
      for (var i=1; i<=3; i++) {
        document.getElementById(i).checked = (i === colorChoices[mode].default) ? true : false;
      }
      for (var i = 1; i <= mode; i++) {
        document.getElementById("player"+i).type = 'text';
      }
      updateColors();
    }

    function updateColors() {
      var e = document.getElementById("mode");
      var mode = parseInt(e.options[e.selectedIndex].value);
      for (var n_color = 1; n_color <= 3; n_color++) {
        if (document.getElementById(n_color).checked) break;
      }
      var colors = { // attribution des couleurs à chaque joueur
        1: {
          1: [[1],[2]],
          2: [[1,3],[2,4]],
          3: [[1,3,5],[2,4,6]]
        },
        2: {
          1: [[1],[2]],
          2: [[1,3],[2,4]],
          3: [[1,3,5],[2,4,6]]
        },
        3: { 2: [[1,3],[4,5],[2,6]] },
        4: { 1: [[1],[2],[3],[4]] },
        6: { 1: [[1],[3],[6],[2],[4],[5]] }
      }[mode][n_color];
      for (var n=1; n<=mode; n++) {
        var code = '';
        for (var i=0, max = colors[n-1].length; i < max; i++) {
          code += "<img class='imagetag' src='images/pion" + colors[n-1][i] + ".png'/>";
        }
        document.getElementById('player'+n+'colors').innerHTML = code;
      }
      for (var n=mode+1; n<=6; n++) {
        document.getElementById('player'+n+'colors').innerHTML = '';
      }
    }
  </script>
  </body>
</html>
