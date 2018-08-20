utilities.someSharedMethod(); // méthode partagé entre client en serveur

// Mise en place des événements

  var newGameForm = document.getElementById('newGameForm'), // on récupère le formulaire de création de partie
      inputs = document.querySelectorAll('input[type=text]'); // on récupère tous les champs de texte du formulaire
  for (var i = 0; i <= 5; i++) { // pour les joueurs 1 à 6
      inputs[i].addEventListener('keyup', function(event) { // on lie la fonction de vérification à l'évènement
          Client.checkNewGameForm[event.target.id](event.target.id); // "event.target" représente l'input actuellement modifié
      });
  }

  newGameForm.addEventListener('submit', function(event) { // on lie une fonction à l'évènement submit pour une nouvelle partie
      var result = true;
      var element = document.getElementById("mode"); // on récupère le menu déroulant
      var mode = element.options[element.selectedIndex].value; // on récupère sa valeur
      for (var i in Client.checkNewGameForm) { // pour chaque fonction de vérification
          result = (parseInt(i[6]) > mode || Client.checkNewGameForm[i](i)) && result; // on effectue la vérification, que le joueur va jouer, que la fonction renvoit tout et que les autres fonctions ont été validées
      }
      if (result === true) { // si tout est bon
        document.newGameForm.submit(); // on envoie le formulaire
      }
      event.preventDefault(); // on empèche le comportement par défaut du bouton d'envoi
  });


// même chose pour le formulaire pour rejoindre une partie
  var joinGameForm = document.getElementById('joinGameForm'),
      inputs = document.querySelectorAll('input[type=text]');
  for (var i = 6; i <= 7; i++) {
      inputs[i].addEventListener('keyup', function(event) {
          Client.checkJoinGameForm[event.target.id](event.target.id);
      });
  }

  joinGameForm.addEventListener('submit', function(event) {
      var result = true;
      for (var i in Client.checkJoinGameForm) {
          result = (Client.checkJoinGameForm[i](i) && result);
      }
      if (result === true) {
        document.joinGameForm.submit();
      }
      event.preventDefault();
  });

  var boxes = document.querySelectorAll('input[type=checkbox]'), // on séléctionne tous les inputs de type checkbox
      boxesLength = boxes.length;
  for (var i = 0; i < boxesLength; i++) { // pour chaque checkbox
      boxes[i].addEventListener('click', function(event) { // on lie la fonction de vérification à l'event "click"
        Client.checkNewGameForm["player" + event.target.id[4]]("player" + event.target.id[4]);
      });
  }

// initialisation

Client.deactivateTooltips(); // on désactive tous les tooltips

for (var i=2;i<=6;i++) { // pour tous les joueurs sauf le premier
  Client.disablePlayer(i); // on les cache
}

Client.updateChoices(); // on affiche les options correspondantes au nombre de joueurs choisi
