<?php
if (isset($_GET['name']) AND isset($_GET['score']) AND ($_GET['score']<500) AND ($_GET['score']>0))
{
	try
	{
		$bdd = new PDO('mysql:host=localhost;dbname=dames_chinoises;charset=utf8', 'root', '');
	}
	catch(Exception $e)
	{
		die('Erreur : '.$e->getMessage());
	}
	$name= $_GET['name'];
	$score= (int) $_GET['score'];
	$adversaire1= $_GET['adversaire1'];
	$adversaire2= $_GET['adversaire2'];
	$adversaire3= $_GET['adversaire3'];
	$adversaire4= $_GET['adversaire4'];
	$adversaire5= $_GET['adversaire5'];
	$requete = "INSERT INTO parties (nom, score, adversaire1, adversaire2, adversaire3, adversaire4, adversaire5, dategame) VALUES ('" . $name . "', " . $score . ", '" . $adversaire1 . "', '" . $adversaire2 . "', '" . $adversaire3 . "', '" . $adversaire4 . "', '" . $adversaire5 .  "', now())";
	$bdd->exec($requete);
}
?>
