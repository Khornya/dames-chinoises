<?php
if (isset($_GET['name']) AND isset($_GET['score']) AND ($_GET['score']<500) AND ($_GET['score']>0))
{
	try
	{
		$bdd = new PDO('mysql:host=localhost;dbname=dames_chinoises;charset=utf8', 'root', 'root');
	}
	catch(Exception $e)
	{
		die('Erreur : '.$e->getMessage());
	}
	$name= $_GET['name'];
	$score= (int) $_GET['score'];
	$reponse = $bdd->query("INSERT INTO parties (ID, nom, score, dategame) VALUES (NULL,'$name','$score',now())");
}
echo "<meta http-equiv='refresh' content='0; url=home.php'>";
?>
