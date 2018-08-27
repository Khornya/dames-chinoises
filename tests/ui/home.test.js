var assert = require('assert');

describe('Bouton "Voir plus / Voir moins"', function() {
  it('devrait afficher / masquer le texte', function () {
    browser.url('http://localhost:8000')
    browser.click('#seeMoreButton')
    assert.equal(browser.getCssProperty('#seeMoreDiv','display').value, 'block')
    browser.click('#seeMoreButton')
    assert.equal(browser.getCssProperty('#seeMoreDiv','display').value, 'none')
  });
});

describe('Choix du nombre de couleurs', function() {
  it('devrait changer les couleurs pour chaque joueur', () => {
    browser.url('http://localhost:8000');
    browser.click('#colors2')
    assert.equal(browser.getHTML('#player1colors'), '<span id="player1colors"><img class="imagetag" src="images/pion1.png"><img class="imagetag" src="images/pion3.png"></span>')
    assert.equal(browser.getHTML('#player2colors'), '<span id="player2colors"><img class="imagetag" src="images/pion2.png"><img class="imagetag" src="images/pion4.png"></span>')
    browser.click('#colors3')
    assert.equal(browser.getHTML('#player1colors'), '<span id="player1colors"><img class="imagetag" src="images/pion1.png"><img class="imagetag" src="images/pion3.png"><img class="imagetag" src="images/pion5.png"></span>')
    assert.equal(browser.getHTML('#player2colors'), '<span id="player2colors"><img class="imagetag" src="images/pion2.png"><img class="imagetag" src="images/pion4.png"><img class="imagetag" src="images/pion6.png"></span>')
    browser.click('#colors1')
    assert.equal(browser.getHTML('#player1colors'), '<span id="player1colors"><img class="imagetag" src="images/pion1.png"></span>')
    assert.equal(browser.getHTML('#player2colors'), '<span id="player2colors"><img class="imagetag" src="images/pion2.png"></span>')
  });
});

describe('Choix du nombre de joueurs', function() {
  it('devrait montrer 2 joueurs par défaut', () => {
    browser.url('http://localhost:8000')
    assert.equal(browser.isSelected('option[value="2"]'), true)
    assert.equal(browser.getCssProperty('#player1','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player2','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player3','display').value, 'none')
    assert.equal(browser.getCssProperty('#player4','display').value, 'none')
    assert.equal(browser.getCssProperty('#player5','display').value, 'none')
    assert.equal(browser.getCssProperty('#player6','display').value, 'none')
    assert.equal(browser.getCssProperty('#color_choice','display').value, 'inline')
    assert.equal(browser.getHTML('#player1colors'), '<span id="player1colors"><img class="imagetag" src="images/pion1.png"></span>')
    assert.equal(browser.getHTML('#player2colors'), '<span id="player2colors"><img class="imagetag" src="images/pion2.png"></span>')
  });
  it('devrait changer les champs disponibles', () => {
    browser.url('http://localhost:8000')
    var menu = $('#mode')
    menu.selectByIndex(1)
    assert.equal(browser.getCssProperty('#player1','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player2','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player3','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player4','display').value, 'none')
    assert.equal(browser.getCssProperty('#player5','display').value, 'none')
    assert.equal(browser.getCssProperty('#player6','display').value, 'none')
    assert.equal(browser.getCssProperty('#color_choice','display').value, 'none')
    assert.equal(browser.getHTML('#player1colors'), '<span id="player1colors"><img class="imagetag" src="images/pion1.png"><img class="imagetag" src="images/pion3.png"></span>')
    assert.equal(browser.getHTML('#player2colors'), '<span id="player2colors"><img class="imagetag" src="images/pion4.png"><img class="imagetag" src="images/pion5.png"></span>')
    assert.equal(browser.getHTML('#player3colors'), '<span id="player3colors"><img class="imagetag" src="images/pion2.png"><img class="imagetag" src="images/pion6.png"></span>')
    menu.selectByIndex(2)
    assert.equal(browser.getCssProperty('#player1','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player2','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player3','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player4','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player5','display').value, 'none')
    assert.equal(browser.getCssProperty('#player6','display').value, 'none')
    assert.equal(browser.getCssProperty('#color_choice','display').value, 'none')
    assert.equal(browser.getHTML('#player1colors'), '<span id="player1colors"><img class="imagetag" src="images/pion1.png"></span>')
    assert.equal(browser.getHTML('#player2colors'), '<span id="player2colors"><img class="imagetag" src="images/pion2.png"></span>')
    assert.equal(browser.getHTML('#player3colors'), '<span id="player3colors"><img class="imagetag" src="images/pion3.png"></span>')
    assert.equal(browser.getHTML('#player4colors'), '<span id="player4colors"><img class="imagetag" src="images/pion4.png"></span>')
    menu.selectByIndex(3)
    assert.equal(browser.getCssProperty('#player1','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player2','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player3','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player4','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player5','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player6','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#color_choice','display').value, 'none')
    assert.equal(browser.getHTML('#player1colors'), '<span id="player1colors"><img class="imagetag" src="images/pion1.png"></span>')
    assert.equal(browser.getHTML('#player2colors'), '<span id="player2colors"><img class="imagetag" src="images/pion3.png"></span>')
    assert.equal(browser.getHTML('#player3colors'), '<span id="player3colors"><img class="imagetag" src="images/pion6.png"></span>')
    assert.equal(browser.getHTML('#player4colors'), '<span id="player4colors"><img class="imagetag" src="images/pion2.png"></span>')
    assert.equal(browser.getHTML('#player5colors'), '<span id="player5colors"><img class="imagetag" src="images/pion4.png"></span>')
    assert.equal(browser.getHTML('#player6colors'), '<span id="player6colors"><img class="imagetag" src="images/pion5.png"></span>')
    menu.selectByIndex(0)
    assert.equal(browser.getCssProperty('#player1','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player2','display').value, 'inline-block')
    assert.equal(browser.getCssProperty('#player3','display').value, 'none')
    assert.equal(browser.getCssProperty('#player4','display').value, 'none')
    assert.equal(browser.getCssProperty('#player5','display').value, 'none')
    assert.equal(browser.getCssProperty('#player6','display').value, 'none')
    assert.equal(browser.getCssProperty('#color_choice','display').value, 'inline')
    assert.equal(browser.getHTML('#player1colors'), '<span id="player1colors"><img class="imagetag" src="images/pion1.png"></span>')
    assert.equal(browser.getHTML('#player2colors'), '<span id="player2colors"><img class="imagetag" src="images/pion2.png"></span>')
  });
});

describe('Vérifier le formulaire pour créer une partie', function () {
  it('devrait afficher un tooltip si 2 joueurs ont le même nom', () => {
    browser.url('http://localhost:8000')
    var menu = $('#mode')
    browser.setValue('#player1', 'Joe')
    browser.setValue('#player2', 'Joe')
    browser.click('#JOUER')
    assert.equal(browser.getUrl(), 'http://localhost:8000/')
    assert.equal(browser.getCssProperty('#player2tooltip', 'display').value, 'inline-block')
    assert.equal(browser.getText('#player2tooltip'), 'Ce nom est déjà pris')
    menu.selectByIndex(1)
    browser.setValue('#player3', 'Joe')
    browser.click('#JOUER')
    assert.equal(browser.getUrl(), 'http://localhost:8000/')
    assert.equal(browser.getCssProperty('#player3tooltip', 'display').value, 'inline-block')
    assert.equal(browser.getText('#player3tooltip'), 'Ce nom est déjà pris')
    browser.setValue('#player2', 'John')
    menu.selectByIndex(0)
    browser.click('#JOUER')
    assert.equal(browser.getUrl(), 'http://localhost:8000/game')
    // assert.equal(browser.getValue('#role'),'host')
    // problème : affiche 'ce nom est déjà pris' sur la page de jeu
  });
  it('devrait afficher un tooltip si un nom ne remplit pas les critères', () => {
    browser.url('http://localhost:8000')
    var menu = $('#mode')
    browser.setValue('#player1', 'Joe-Jack-John')
    browser.click('#JOUER')
    assert.equal(browser.getUrl(), 'http://localhost:8000/')
    assert.equal(browser.getCssProperty('#player1tooltip', 'display').value, 'inline-block')
    assert.equal(['Le nom doit comprendre :\n- 2 à 10 caractères alphanumériques\nou des tirets','Le nom doit comprendre :- 2 à 10 caractères alphanumériquesou des tirets'].indexOf(browser.getText('#player1tooltip')) !== -1, true) // cas spécial Safari
    browser.setValue('#player1', 'Joe')
    browser.click('#JOUER')
    assert.equal(browser.getUrl(), 'http://localhost:8000/game')
    assert.equal(browser.getValue('#role'),'host')
  });
});

describe('Vérifier le formulaire pour rejoindre une partie', function () {
  it('devrait afficher un tooltip si le nom ne remplit pas les critères', () => {
    browser.url('http://localhost:8000')
    browser.setValue('#player', 'Joe-Jack-John')
    browser.click('#REJOINDRE')
    assert.equal(browser.getUrl(), 'http://localhost:8000/')
    assert.equal(browser.getCssProperty('#playertooltip', 'display').value, 'inline-block')
    assert.equal((['Le nom doit comprendre :\n- 2 à 10 caractères alphanumériques\nou des tirets','Le nom doit comprendre :- 2 à 10 caractères alphanumériquesou des tirets'].indexOf(browser.getText('#playertooltip')) !== -1), true) // cas spécial Safari
    browser.setValue('#player', 'Joe')
    assert.equal(browser.getCssProperty('#playertooltip', 'display').value, 'none')
  });
  it('devrait afficher un tooltip si le numéro de partie ne remplit pas les critères', () => {
    browser.url('http://localhost:8000')
    browser.setValue('#roomID', '999999')
    browser.click('#REJOINDRE')
    assert.equal(browser.getUrl(), 'http://localhost:8000/')
    assert.equal(browser.getCssProperty('#roomIDtooltip', 'display').value, 'inline-block')
    assert.equal(browser.getText('#roomIDtooltip'), 'Le game ID doit être compris entre 0 et 100000')
  });
});
