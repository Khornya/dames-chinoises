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

describe('Partie complète 2 joueurs 1 couleur', function() {
  it('devrait jouer une partie', () =>{
    browser.url('http://localhost:8000')
    browser.setValue('#player1', 'TestUser1')
    browser.click('#JOUER')
    var gameId = browser.getAttribute('#gameId', 'value')
    browser.newWindow('http://localhost:8000', 'User2')
    browser.setValue('#player', 'TestUser2')
    browser.setValue('#roomID', gameId)
    browser.click('#REJOINDRE')
    var clicks = [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11]]
    var startCell, endCell, image, currentTab = ''
    for (var i=0; i<clicks.length; i+=2) {
      browser.switchTab(currentTab)
      startCell = 'div[line="'+ clicks[i][0] +'"][column="' + clicks[i][1] +'"]'
      endCell = 'div[line="'+ clicks[i+1][0] +'"][column="' + clicks[i+1][1] +'"]'
      image = browser.getHTML(startCell,false)
      browser.click(startCell)
      browser.click(endCell)
      browser.waitUntil(() => { return browser.getHTML(endCell,false) === image }, 3000, 'le déplacement devrait être terminé')
      currentTab = (currentTab === '')? 'User2' : ''
    }
  });
  it('devrait recommencer une partie', () => {
    browser.click('#restartButton')
    browser.switchTab('')
    browser.click('#restartButton')
    assert.equal(browser.getHTML('#board'), '<section id="board"><div id="line0" class="line"><div class="cell" line="0" column="12"><img alt="pion" src="images/pion1.png"></div></div><div id="line1" class="line"><div class="cell" line="1" column="11"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="1" column="13"><img alt="pion" src="images/pion1.png"></div></div><div id="line2" class="line"><div class="cell" line="2" column="10"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="2" column="12"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="2" column="14"><img alt="pion" src="images/pion1.png"></div></div><div id="line3" class="line"><div class="cell" line="3" column="9"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="3" column="11"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="3" column="13"><img alt="pion" src="images/pion1.png"></div><div class="cell" line="3" column="15"><img alt="pion" src="images/pion1.png"></div></div><div id="line4" class="line"><div class="cell" line="4" column="0"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="4" column="2"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="4" column="4"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="4" column="6"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="4" column="8"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="4" column="10"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="4" column="12"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="4" column="14"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="4" column="16"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="4" column="18"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="4" column="20"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="4" column="22"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="4" column="24"><img alt="pion" src="images/pion5.png"></div></div><div id="line5" class="line"><div class="cell" line="5" column="1"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="5" column="3"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="5" column="5"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="5" column="7"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="9"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="11"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="13"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="15"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="17"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="5" column="19"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="5" column="21"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="5" column="23"><img alt="pion" src="images/pion5.png"></div></div><div id="line6" class="line"><div class="cell" line="6" column="2"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="6" column="4"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="6" column="6"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="8"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="10"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="12"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="14"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="16"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="18"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="6" column="20"><img alt="pion" src="images/pion5.png"></div><div class="cell" line="6" column="22"><img alt="pion" src="images/pion5.png"></div></div><div id="line7" class="line"><div class="cell" line="7" column="3"><img alt="pion" src="images/pion3.png"></div><div class="cell" line="7" column="5"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="7"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="9"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="11"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="13"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="15"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="17"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="19"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="7" column="21"><img alt="pion" src="images/pion5.png"></div></div><div id="line8" class="line"><div class="cell" line="8" column="4"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="6"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="8"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="10"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="12"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="14"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="16"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="18"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="8" column="20"><img alt="pion" src="images/pion-1.png"></div></div><div id="line9" class="line"><div class="cell" line="9" column="3"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="9" column="5"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="7"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="9"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="11"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="13"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="15"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="17"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="19"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="9" column="21"><img alt="pion" src="images/pion4.png"></div></div><div id="line10" class="line"><div class="cell" line="10" column="2"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="10" column="4"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="10" column="6"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="8"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="10"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="12"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="14"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="16"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="18"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="10" column="20"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="10" column="22"><img alt="pion" src="images/pion4.png"></div></div><div id="line11" class="line"><div class="cell" line="11" column="1"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="11" column="3"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="11" column="5"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="11" column="7"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="9"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="11"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="13"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="15"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="17"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="11" column="19"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="11" column="21"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="11" column="23"><img alt="pion" src="images/pion4.png"></div></div><div id="line12" class="line"><div class="cell" line="12" column="0"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="12" column="2"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="12" column="4"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="12" column="6"><img alt="pion" src="images/pion6.png"></div><div class="cell" line="12" column="8"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="12" column="10"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="12" column="12"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="12" column="14"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="12" column="16"><img alt="pion" src="images/pion-1.png"></div><div class="cell" line="12" column="18"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="12" column="20"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="12" column="22"><img alt="pion" src="images/pion4.png"></div><div class="cell" line="12" column="24"><img alt="pion" src="images/pion4.png"></div></div><div id="line13" class="line"><div class="cell" line="13" column="9"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="13" column="11"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="13" column="13"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="13" column="15"><img alt="pion" src="images/pion2.png"></div></div><div id="line14" class="line"><div class="cell" line="14" column="10"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="14" column="12"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="14" column="14"><img alt="pion" src="images/pion2.png"></div></div><div id="line15" class="line"><div class="cell" line="15" column="11"><img alt="pion" src="images/pion2.png"></div><div class="cell" line="15" column="13"><img alt="pion" src="images/pion2.png"></div></div><div id="line16" class="line"><div class="cell" line="16" column="12"><img alt="pion" src="images/pion2.png"></div></div></section>')
  });
});

describe('Choix du nombre de couleurs', function() {
  it('devrait changer les couleurs pour chaque joueur', () =>{
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
    browser.setValue('#player1', 'Joe')
    browser.setValue('#player2', 'Joe')
    browser.click('#JOUER')
    browser.debug()
    assert.equal(browser.getCssProperty('#player1colors + .tooltip', 'display').value, 'inline-block')
    assert.equal(browser.getCssProperty("//input[@id='player2']", 'display').value, 'inline-block')
    assert.equal(browser.getText('#player1colors + .tooltip'), 'Ce nom est déjà pris')
    // assert.equal(browser.getText('#player2colors + .tooltip'), 'Ce nom est déjà pris')
  });
});

describe('Vérifier le formulaire pour rejoindre une partie', function () {

});

// .expect(Selector('#player1colors').nextSibling('.tooltip').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player1colors').nextSibling('.tooltip').innerText).eql("Ce nom est déjà pris")
//     .expect(Selector('#player2colors').nextSibling('.tooltip').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player2colors').nextSibling('.tooltip').innerText).eql("Ce nom est déjà pris")
//     .typeText(Selector('#player2'),'John', { replace: true })
//     .click('#JOUER')
//     .expect(getLocation()).contains('localhost:8000/game')
//     .navigateTo('http://localhost:8000')
//     .click('#mode')
//     .click(Selector('#mode').find('option').withText('3 joueurs'))
//     .typeText(Selector('#player1'),'Joe')
//     .typeText(Selector('#player2'),'John')
//     .typeText(Selector('#player3'),'Joe-Jack-John')
//     .click('#JOUER')
//     .expect(Selector('#player3colors').nextSibling('.tooltip').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player3colors').nextSibling('.tooltip').innerText).eql("Le nom doit comprendre :\n- 2 à 10 caractères alphanumériques\nou des tirets")
//     .click('#mode')
//     .click(Selector('#mode').find('option').withText('2 joueurs'))
//     .click('#JOUER')
//     .expect(getLocation()).contains('localhost:8000/game')
// });

describe.only('Partie à 3 IA', function() {
  it('devrait lancer une partie aevc 3 IA', () => {
    browser.url('http://localhost:8000')
    browser.execute(() => {
      var checkbox = document.createElement('input');
      document.getElementById('player1').parentNode.insertBefore(checkbox, document.getElementById('player1colors').nextSibling);
      checkbox.outerHTML = '<input id="ordi1" type="checkbox" name="ordi1" value="Ordinateur" onclick="Client.disablePlayer(1)" style="display: inline;">'
      var level = document.createElement('input');
      var label = document.createElement('label');
      document.getElementById('level_choice').appendChild(level);
      document.getElementById('level_choice').appendChild(label);
      level.outerHTML = '<input id="level3" type="radio" name="level" value="3" onclick="">';
      label.outerHTML = '<label for="level3" onclick="">Test</label>';
    })
    var menu = $('#mode')
    menu.selectByIndex(1)
    browser.click('#ordi1')
    browser.click('#ordi2')
    browser.click('#ordi3')
    browser.click('#level3')
    browser.click('#JOUER')
    browser.waitForVisible('#modal', 1000000);
  });
});

// var clicks = { // coordonnées des cases à cliquer
//   2: { // nombre de joueurs
//     1: // nombre de couleurs
//       [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11]],
//     2: [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11],[4,4],[6,6],[10,22],[10,18],[4,0],[8,16],[12,24],[12,8],[6,4],[6,8],[11,19],[7,7],[4,2],[6,4],[11,23],[9,13],[5,3],[9,15],[11,21],[11,17],[6,6],[12,24],[12,18],[10,8],[6,2],[10,14],[9,21],[5,9],[6,4],[6,16],[9,13],[9,9],[5,1],[9,21],[10,8],[6,4],[9,15],[11,21],[12,8],[6,2],[4,6],[12,18],[10,20],[4,6],[10,14],[10,22],[5,9],[5,1],[6,16],[10,20],[12,20],[12,16],[7,3],[7,5],[10,18],[10,6],[7,5],[9,15],[12,16],[8,4],[4,10],[12,10],[12,22],[4,2],[8,16],[8,20],[5,1],[4,0],[5,5],[9,17],[7,7],[5,1],[6,14],[6,16],[10,6],[6,6],[4,14],[10,8],[9,9],[5,5],[9,15],[9,19],[11,17],[11,15],[9,21],[11,23],[11,15],[7,3],[9,17],[11,19],[6,6],[4,4],[6,8],[7,9],[6,2],[5,3],[7,9],[13,15],[8,4],[6,2],[5,11],[13,11]]
//   }
// }
