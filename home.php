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
            <form action="/game.php" target="_self" method="POST">
              <select id="mode" name="nombre_joueurs">
                <option value="1" onclick="playermanes()">1 player vs CPU</option>
                <option value="2" onclick="playermanes()">2 players</option>
                <option value="3" onclick="playermanes()">3 players </option>
                <option value="4" onclick="playermanes()">4 players </option>
                <option value="5" onclick="playermanes()">5 players </option>
                <option value="6" onclick="playermanes()">6 players </option>
              </select>
              <br />
                <input type="text" name="player1" id="player1" placeholder="NAME PLAYER 1"/>
                <input type="hidden" name="player2" id="player2" placeholder="NAME PLAYER 2"/>
                <input type="hidden" name="player3" id="player3" placeholder="NAME PLAYER 3"/>
                <br />
                <input type="hidden" name="player4" id="player4" placeholder="NAME PLAYER 4"/>
                <input type="hidden" name="player5" id="player5" placeholder="NAME PLAYER 5"/>
                <input type="hidden" name="player6" id="player6" placeholder="NAME PLAYER 6"/>
                <br />
                Nombre de couleurs :
                <input type="radio" name="colors" value="1" id="1" checked/>
                <label for="1">1</label>
                <input type="radio" name="colors" value="2" id="2" />
                <label for="2">2</label>
                <input type="radio" name="colors" value="3" id="3" />
                <label for="3">3</label>
              <br/>
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

    function playermanes() {
      for (i = 1; i <= 6; i++) {
        document.getElementById("player"+i).type = 'hidden';
      } 
      var e = document.getElementById("mode");
      var strUser = e.options[e.selectedIndex].value;
      for (i = 1; i <= strUser; i++) {
        document.getElementById("player"+i).type = 'text';
      } 
    }
  </script>
  </body>
</html>