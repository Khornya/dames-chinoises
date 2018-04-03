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
            </br>NOM JOUEUR: <?php echo $_POST["player1"]; ?>
            </br>NOMBRE JOUEURS: <?php echo $_POST["nombre_joueurs"]; ?>
            </br>NOMBRE COULEURS: <?php echo $_POST["colors"]; ?>
          </p>
        </section>
      </div>
      <footer>
        <a href="mailto:contact@hophophop.fr">Nous contacter</a>
      </footer>
    </div>
    <script src='tests.js'></script>
    <script src='game.js'></script>
  </body>
</html>