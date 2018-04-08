<?php 
session_start();
  if (!isset($_POST["colors"]) || !isset($_POST["nombre_joueurs"]) )
   {
      header("location: home.php");
   }
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
      <form style="display:none">
        <input name="nombre_joueurs" id="nombre_joueurs" value="<?php echo htmlspecialchars($_POST["nombre_joueurs"]); ?>" />
        <input name="player1" id="player1" value="<?php if (empty($_POST["player1"])) echo "PLAYER 1"; else echo htmlspecialchars($_POST["player1"]); ?>" />
        <input name="player2" id="player2" value="<?php if (empty($_POST["player2"])) echo "PLAYER 2"; else echo htmlspecialchars($_POST["player2"]); ?>" />
        <input name="player3" id="player3" value="<?php if (empty($_POST["player3"])) echo "PLAYER 3"; else echo htmlspecialchars($_POST["player3"]); ?>" />
        <input name="player4" id="player4" value="<?php if (empty($_POST["player4"])) echo "PLAYER 4"; else echo htmlspecialchars($_POST["player4"]); ?>" />
        <input name="player5" id="player5" value="<?php if (empty($_POST["player5"])) echo "PLAYER 5"; else echo htmlspecialchars($_POST["player5"]); ?>" />
        <input name="player6" id="player6" value="<?php if (empty($_POST["player6"])) echo "PLAYER 6"; else echo htmlspecialchars($_POST["player6"]); ?>" />
        <input name="colors" id="colors" value="<?php echo htmlspecialchars($_POST["colors"]); ?>" />
      </form>
      <div id='game_zone'>
        <section id='left_panel'>
        </section>
        <section id="board">
        </section>
        <section id='right_panel'>
          <p>
            <a href="">Voir les règles</a>
          </p>
          <p>
            <a href="">Quitter</a>
          </p>
        </section>
      </div>
      <footer>
        <button id="pass" style="position:absolute;transition: .5s ease;left: 202px;top: 198px;display:none">pass</button>
        <a href="mailto:contact@hophophop.fr">Nous contacter</a>
      </footer>
    </div>
    <script src='tests.js'></script>
    <script src='game.js'></script>
  </body>
</html>
