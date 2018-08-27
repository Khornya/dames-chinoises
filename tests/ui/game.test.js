var assert = require('assert');

function setTestLevel() {
  var checkbox = document.createElement('input');
  document.getElementById('player1').parentNode.insertBefore(checkbox, document.getElementById('player1colors').nextSibling);
  checkbox.outerHTML = '<input id="ordi1" type="checkbox" name="ordi1" value="Ordinateur" onclick="Client.disablePlayer(1)" style="display: inline;">'
  var level = document.createElement('input');
  var label = document.createElement('label');
  document.getElementById('level_choice').appendChild(level);
  document.getElementById('level_choice').appendChild(label);
  level.outerHTML = '<input id="level0" type="radio" name="level" value="0" onclick="">';
  label.outerHTML = '<label for="level0" onclick="">Test</label>';
}

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

describe.skip('Parties entre IA', function() {
  it('devrait lancer une partie avec 2 IA 1 couleur', () => {
    browser.url('http://localhost:8000')
    browser.execute(setTestLevel)
    browser.click('#ordi1')
    browser.click('#ordi2')
    browser.click('#level0')
    browser.click('#colors1')
    browser.click('#JOUER')
    browser.waitForVisible('#modal', 1000000);
  });
  it('devrait lancer une partie avec 2 IA 2 couleurs', () => {
    browser.url('http://localhost:8000')
    browser.execute(setTestLevel)
    browser.click('#ordi1')
    browser.click('#ordi2')
    browser.click('#level0')
    browser.click('#colors2')
    browser.click('#JOUER')
    browser.waitForVisible('#modal', 1000000);
  });
  it('devrait lancer une partie avec 2 IA 3 couleurs', () => {
    browser.url('http://localhost:8000')
    browser.execute(setTestLevel)
    browser.click('#ordi1')
    browser.click('#ordi2')
    browser.click('#level0')
    browser.click('#colors3')
    browser.click('#JOUER')
    browser.waitForVisible('#modal', 1000000);
  });
  it('devrait lancer une partie avec 3 IA', () => {
    browser.url('http://localhost:8000')
    browser.execute(setTestLevel)
    var menu = $('#mode')
    menu.selectByIndex(1)
    browser.click('#ordi1')
    browser.click('#ordi2')
    browser.click('#ordi3')
    browser.click('#level0')
    browser.click('#JOUER')
    browser.waitForVisible('#modal', 1000000);
  });
  it('devrait lancer une partie avec 4 IA', () => {
    browser.url('http://localhost:8000')
    browser.execute(setTestLevel)
    var menu = $('#mode')
    menu.selectByIndex(2)
    browser.click('#ordi1')
    browser.click('#ordi2')
    browser.click('#ordi3')
    browser.click('#ordi4')
    browser.click('#level0')
    browser.click('#JOUER')
    browser.waitForVisible('#modal', 1000000);
  });
  it('devrait lancer une partie avec 6 IA', () => {
    browser.url('http://localhost:8000')
    browser.execute(setTestLevel)
    var menu = $('#mode')
    menu.selectByIndex(3)
    browser.click('#ordi1')
    browser.click('#ordi2')
    browser.click('#ordi3')
    browser.click('#ordi4')
    browser.click('#ordi5')
    browser.click('#ordi6')
    browser.click('#level0')
    browser.click('#JOUER')
    browser.waitForVisible('#modal', 1000000);
  });
});
