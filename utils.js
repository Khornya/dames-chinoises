(function(exports){

  // ici le code à partager entre client et serveur
  exports.someSharedMethod = function(){
       console.log("it works !");
  };

}(typeof exports === 'undefined' ? this.utilities = {} : exports));
