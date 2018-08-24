var assert = require('assert');

describe('Bouton "Voir plus / Voir moins"', function() {
  it('should toggle text', function () {
    browser.url('http://localhost:8000');
    browser.click('#seeMoreButton')
    assert.equal(browser.getCssProperty('#seeMoreDiv','display').value, 'block');
    browser.click('#seeMoreButton')
    assert.equal(browser.getCssProperty('#seeMoreDiv','display').value, 'none');
  });
});

describe('Partie complète 2 joueurs 1 couleur', function() {
  it('devrait jouer une partie', () =>{
    browser.url('http://localhost:8000');
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
});

// import { Selector } from 'testcafe';
// import { ClientFunction } from 'testcafe';
// import { Role } from 'testcafe';
//
// const getLocation = ClientFunction(() => document.location.href);
//
// var gameId;
//
// const hostUser = Role('http://localhost:8000', async t => {
//   await t
//     .typeText('#player1', 'TestUser1')
//     .click('#JOUER');
//     gameId = await Selector('#gameId').value
// });
//
// const guestUser = Role('http://localhost:8000', async t => {
//   await t
//     .typeText('#player', 'TestUser2')
//     .typeText('#roomID', gameId)
//     .click('#REJOINDRE')
// });
//
// fixture `Page d'accueil`
//   .page `http://localhost:8000`;
//
// test('Bouton "Voir plus / Voir moins"', async t => {
//   await t
//       .click('#seeMoreButton')
//       .expect(Selector('#seeMoreDiv').getStyleProperty('display')).eql('block');
//   await t
//       .click('#seeMoreButton')
//       .expect(Selector('#seeMoreDiv').getStyleProperty('display')).eql('none');
// });
//
// test('Choix du nombre de couleurs', async t => {
//   await t
//     .click('input#colors2')
//     .expect(Selector('#player1colors').childElementCount).eql(2)
//     .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
//     .expect(Selector('#player1colors').child(1).getAttribute('src')).eql('images/pion3.png')
//     .expect(Selector('#player2colors').childElementCount).eql(2)
//     .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion2.png')
//     .expect(Selector('#player2colors').child(1).getAttribute('src')).eql('images/pion4.png')
//   await t
//     .click('#colors3')
//     .expect(Selector('#player1colors').childElementCount).eql(3)
//     .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
//     .expect(Selector('#player1colors').child(1).getAttribute('src')).eql('images/pion3.png')
//     .expect(Selector('#player1colors').child(2).getAttribute('src')).eql('images/pion5.png')
//     .expect(Selector('#player2colors').childElementCount).eql(3)
//     .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion2.png')
//     .expect(Selector('#player2colors').child(1).getAttribute('src')).eql('images/pion4.png')
//     .expect(Selector('#player2colors').child(2).getAttribute('src')).eql('images/pion6.png')
//   await t
//     .click('#colors1')
//     .expect(Selector('#player1colors').childElementCount).eql(1)
//     .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
//     .expect(Selector('#player2colors').childElementCount).eql(1)
//     .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion2.png')
// });
//
// test('Choix du nombre de joueurs', async t => {
//   await t
//     // 3 joueurs
//     .click('#mode')
//     .click(Selector('#mode').find('option').withText('3 joueurs'))
//     .expect(Selector('#player1').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player2').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player3').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player4').getStyleProperty('display')).eql('none')
//     .expect(Selector('#player5').getStyleProperty('display')).eql('none')
//     .expect(Selector('#player6').getStyleProperty('display')).eql('none')
//     .expect(Selector('#color_choice').getStyleProperty('display')).eql('none')
//     .expect(Selector('#player1colors').childElementCount).eql(2)
//     .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
//     .expect(Selector('#player1colors').child(1).getAttribute('src')).eql('images/pion3.png')
//     .expect(Selector('#player2colors').childElementCount).eql(2)
//     .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion4.png')
//     .expect(Selector('#player2colors').child(1).getAttribute('src')).eql('images/pion5.png')
//     .expect(Selector('#player3colors').childElementCount).eql(2)
//     .expect(Selector('#player3colors').child(0).getAttribute('src')).eql('images/pion2.png')
//     .expect(Selector('#player3colors').child(1).getAttribute('src')).eql('images/pion6.png')
//     // 4 joueurs
//     .click('#mode')
//     .click(Selector('#mode').find('option').withText('4 joueurs'))
//     .expect(Selector('#player1').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player2').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player3').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player4').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player5').getStyleProperty('display')).eql('none')
//     .expect(Selector('#player6').getStyleProperty('display')).eql('none')
//     .expect(Selector('#color_choice').getStyleProperty('display')).eql('none')
//     .expect(Selector('#player1colors').childElementCount).eql(1)
//     .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
//     .expect(Selector('#player2colors').childElementCount).eql(1)
//     .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion2.png')
//     .expect(Selector('#player3colors').childElementCount).eql(1)
//     .expect(Selector('#player3colors').child(0).getAttribute('src')).eql('images/pion3.png')
//     .expect(Selector('#player4colors').childElementCount).eql(1)
//     .expect(Selector('#player4colors').child(0).getAttribute('src')).eql('images/pion4.png')
//     // 6 joueurs
//     .click('#mode')
//     .click(Selector('#mode').find('option').withText('6 joueurs'))
//     .expect(Selector('#player1').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player2').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player3').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player4').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player5').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player6').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#color_choice').getStyleProperty('display')).eql('none')
//     .expect(Selector('#player1colors').childElementCount).eql(1)
//     .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
//     .expect(Selector('#player2colors').childElementCount).eql(1)
//     .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion3.png')
//     .expect(Selector('#player3colors').childElementCount).eql(1)
//     .expect(Selector('#player3colors').child(0).getAttribute('src')).eql('images/pion6.png')
//     .expect(Selector('#player4colors').childElementCount).eql(1)
//     .expect(Selector('#player4colors').child(0).getAttribute('src')).eql('images/pion2.png')
//     .expect(Selector('#player5colors').childElementCount).eql(1)
//     .expect(Selector('#player5colors').child(0).getAttribute('src')).eql('images/pion4.png')
//     .expect(Selector('#player6colors').childElementCount).eql(1)
//     .expect(Selector('#player6colors').child(0).getAttribute('src')).eql('images/pion5.png')
//     // 2 joueurs
//     .click('#mode')
//     .click(Selector('#mode').find('option').withText('2 joueurs'))
//     .expect(Selector('#player1').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player2').getStyleProperty('display')).eql('inline-block')
//     .expect(Selector('#player3').getStyleProperty('display')).eql('none')
//     .expect(Selector('#player4').getStyleProperty('display')).eql('none')
//     .expect(Selector('#player5').getStyleProperty('display')).eql('none')
//     .expect(Selector('#player6').getStyleProperty('display')).eql('none')
//     .expect(Selector('#color_choice').getStyleProperty('display')).eql('inline')
//     .expect(Selector('#player1colors').childElementCount).eql(1)
//     .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
//     .expect(Selector('#player2colors').childElementCount).eql(1)
//     .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion2.png')
// });
//
// test('Vérifier le formulaire pour créer une partie', async t => {
//   await t
//     .typeText(Selector('#player1'),'Joe')
//     .typeText(Selector('#player2'),'Joe')
//     .click('#JOUER')
//     .expect(Selector('#player1colors').nextSibling('.tooltip').getStyleProperty('display')).eql('inline-block')
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
//
// test('Vérifier le formulaire pour rejoindre une partie', async t => {
//   await t
//     .navigateTo('http://localhost:8000')
// });
//
// test.only('Jouer une partie à deux', async t => {
//   await t
//     .useRole(hostUser)
//     .useRole(guestUser)
// });

// var clicks = { // coordonnées des cases à cliquer
//   2: { // nombre de joueurs
//     1: // nombre de couleurs
//       [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11]],
//     2: [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11],[4,4],[6,6],[10,22],[10,18],[4,0],[8,16],[12,24],[12,8],[6,4],[6,8],[11,19],[7,7],[4,2],[6,4],[11,23],[9,13],[5,3],[9,15],[11,21],[11,17],[6,6],[12,24],[12,18],[10,8],[6,2],[10,14],[9,21],[5,9],[6,4],[6,16],[9,13],[9,9],[5,1],[9,21],[10,8],[6,4],[9,15],[11,21],[12,8],[6,2],[4,6],[12,18],[10,20],[4,6],[10,14],[10,22],[5,9],[5,1],[6,16],[10,20],[12,20],[12,16],[7,3],[7,5],[10,18],[10,6],[7,5],[9,15],[12,16],[8,4],[4,10],[12,10],[12,22],[4,2],[8,16],[8,20],[5,1],[4,0],[5,5],[9,17],[7,7],[5,1],[6,14],[6,16],[10,6],[6,6],[4,14],[10,8],[9,9],[5,5],[9,15],[9,19],[11,17],[11,15],[9,21],[11,23],[11,15],[7,3],[9,17],[11,19],[6,6],[4,4],[6,8],[7,9],[6,2],[5,3],[7,9],[13,15],[8,4],[6,2],[5,11],[13,11]]
//   }
// }
