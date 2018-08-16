(function(exports){

  // ici le code des fonctions à exporter
  exports.seeMore = () => { // pour afficher le div qui contient les infos sur les dames chinoises
    var x = document.getElementById("seeMoreDiv"); // on récupère le div #seeMoreDiv
    var y = document.getElementById("seeMoreButton"); // on récupère le bouton #seeMoreButton
    if (x.style.display === "none") { // si le div est masqué, on affiche le div et on change le label du botuon
        x.style.display = "block";
        y.innerHTML = "Voir moins";
    }
    else { // sinon, on masque le div et on change le label du bouton
        x.style.display = "none";
        y.innerHTML = "Voir plus";
    }
  }


}(typeof exports === 'undefined' ? this.Client = {} : exports));
