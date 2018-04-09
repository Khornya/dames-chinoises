<?php
session_start(); /* pour la gestion des sessions plus tard */
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
          <div id="seemore" style='display:none'>
            orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo odio non consectetur porta. Quisque iaculis nec augue a facilisis. Duis mollis nulla odio, non convallis purus commodo ac. Sed in. orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo odio non consectetur porta. Quisque iaculis nec augue a facilisis. Duis mollis nulla odio, non convallis purus commodo ac. Sed in.
          </div>
          <button id="voirPlus" onclick="seemore()">Voir plus</button>
      </section>
      <div id="test">
          <section id="game">
            <h1>Jouer une partie</h1>
            <form name="form" id="form" action="game.php" target="_self" method="POST">
              <select id="mode" name="nombre_joueurs" onclick="updateChoices()">
                <option value="1">1 player vs CPU</option>
                <option value="2">2 players</option>
                <option value="3">3 players</option>
                <option value="4">4 players</option>
                <option value="6">6 players</option>
              </select>
              <br />
              <div>
                <input type="text" name="player1" id="player1" placeholder="NAME PLAYER 1"/><span id="player1colors"></span><input type="checkbox" name="IA1" id="IA1" onclick="disablePlayer(1)" /><label for="IA1" onclick="disablePlayer(1)">IA</label><span class="tooltip"></span>
              </div>
              <div>
                <input type="text" name="player2" id="player2" placeholder="NAME PLAYER 2"/><span id="player2colors"></span><input type="checkbox" name="IA2" id="IA2" onclick="disablePlayer(2)" /><label for="IA2" onclick="disablePlayer(2)">IA</label><span class="tooltip"></span>
              </div>
              <div>
                <input type="text" name="player3" id="player3" placeholder="NAME PLAYER 3"/><span id="player3colors"></span><input type="checkbox" name="IA3" id="IA3" onclick="disablePlayer(3)" /><label for="IA3" onclick="disablePlayer(3)">IA</label><span class="tooltip"></span>
              </div>
              <div>
                <input type="text" name="player4" id="player4" placeholder="NAME PLAYER 4"/><span id="player4colors"></span><input type="checkbox" name="IA4" id="IA4" onclick="disablePlayer(4)" /><label for="IA4" onclick="disablePlayer(4)">IA</label><span class="tooltip"></span>
              </div>
              <div>
                <input type="text" name="player5" id="player5" placeholder="NAME PLAYER 5"/><span id="player5colors"></span><input type="checkbox" name="IA5" id="IA5" onclick="disablePlayer(5)" /><label for="IA5" onclick="disablePlayer(5)">IA</label><span class="tooltip"></span>
              </div>
              <div>
                <input type="text" name="player6" id="player6" placeholder="NAME PLAYER 6"/><span id="player6colors"></span><input type="checkbox" name="IA6" id="IA6" onclick="disablePlayer(6)" /><label for="IA6" onclick="disablePlayer(6)">IA</label><span class="tooltip"></span>
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
          <table>
          <th colspan="3" align="center"><h1>Meilleurs scores</h1></th>
          <?php
            try
            {
              $bdd = new PDO('mysql:host=localhost;dbname=dames_chinoises;charset=utf8', 'root', '');
            }
              catch(Exception $e)
            {
              die('Erreur : '.$e->getMessage());
            }
            $reponse = $bdd->query('SELECT nom, score, dategame FROM parties ORDER BY score ASC LIMIT 0, 5');
            while ($donnees = $reponse->fetch())
            {
              echo "<tr>";
              echo "<td class=\"score\">",$donnees['nom'],"</td>";
              echo "<td class=\"score\">",$donnees['score'],"</td>";
              echo "<td class=\"score\">",$donnees['dategame'],"</td>";
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
  <script src="home.js"></script>
  </body>
</html>
