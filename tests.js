import { Selector } from 'testcafe';

fixture `Page d'accueil`
  .page `http://localhost:8000`;

test('Bouton "Voir plus / Voir moins"', async t => {
  await t
      .click('#seeMoreButton')
      .expect(Selector('#seeMoreDiv').getStyleProperty('display')).eql('block');
  await t
      .click('#seeMoreButton')
      .expect(Selector('#seeMoreDiv').getStyleProperty('display')).eql('none');
});

test('Choix du nombre de couleurs', async t => {
  await t
    .click('input#colors2')
    .expect(Selector('#player1colors').childElementCount).eql(2)
    .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
    .expect(Selector('#player1colors').child(1).getAttribute('src')).eql('images/pion3.png')
    .expect(Selector('#player2colors').childElementCount).eql(2)
    .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion2.png')
    .expect(Selector('#player2colors').child(1).getAttribute('src')).eql('images/pion4.png')
  await t
    .click('#colors3')
    .expect(Selector('#player1colors').childElementCount).eql(3)
    .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
    .expect(Selector('#player1colors').child(1).getAttribute('src')).eql('images/pion3.png')
    .expect(Selector('#player1colors').child(2).getAttribute('src')).eql('images/pion5.png')
    .expect(Selector('#player2colors').childElementCount).eql(3)
    .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion2.png')
    .expect(Selector('#player2colors').child(1).getAttribute('src')).eql('images/pion4.png')
    .expect(Selector('#player2colors').child(2).getAttribute('src')).eql('images/pion6.png')
  await t
    .click('#colors1')
    .expect(Selector('#player1colors').childElementCount).eql(1)
    .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
    .expect(Selector('#player2colors').childElementCount).eql(1)
    .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion2.png')
});

test('Choix du nombre de joueurs', async t => {
  await t // 3 joueurs
    .click('#mode')
    .click(Selector('#mode').find('option').withText('3 joueurs'))
    .expect(Selector('#player1').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player2').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player3').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player4').getStyleProperty('display')).eql('none')
    .expect(Selector('#player5').getStyleProperty('display')).eql('none')
    .expect(Selector('#player6').getStyleProperty('display')).eql('none')
    .expect(Selector('#color_choice').getStyleProperty('display')).eql('none')
    .expect(Selector('#player1colors').childElementCount).eql(2)
    .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
    .expect(Selector('#player1colors').child(1).getAttribute('src')).eql('images/pion3.png')
    .expect(Selector('#player2colors').childElementCount).eql(2)
    .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion4.png')
    .expect(Selector('#player2colors').child(1).getAttribute('src')).eql('images/pion5.png')
    .expect(Selector('#player3colors').childElementCount).eql(2)
    .expect(Selector('#player3colors').child(0).getAttribute('src')).eql('images/pion2.png')
    .expect(Selector('#player3colors').child(1).getAttribute('src')).eql('images/pion6.png')
  await t // 4 joueurs
    .click('#mode')
    .click(Selector('#mode').find('option').withText('4 joueurs'))
    .expect(Selector('#player1').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player2').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player3').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player4').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player5').getStyleProperty('display')).eql('none')
    .expect(Selector('#player6').getStyleProperty('display')).eql('none')
    .expect(Selector('#color_choice').getStyleProperty('display')).eql('none')
    .expect(Selector('#player1colors').childElementCount).eql(1)
    .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
    .expect(Selector('#player2colors').childElementCount).eql(1)
    .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion2.png')
    .expect(Selector('#player3colors').childElementCount).eql(1)
    .expect(Selector('#player3colors').child(0).getAttribute('src')).eql('images/pion3.png')
    .expect(Selector('#player4colors').childElementCount).eql(1)
    .expect(Selector('#player4colors').child(0).getAttribute('src')).eql('images/pion4.png')
  await t // 6 joueurs
    .click('#mode')
    .click(Selector('#mode').find('option').withText('6 joueurs'))
    .expect(Selector('#player1').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player2').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player3').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player4').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player5').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player6').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#color_choice').getStyleProperty('display')).eql('none')
    .expect(Selector('#player1colors').childElementCount).eql(1)
    .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
    .expect(Selector('#player2colors').childElementCount).eql(1)
    .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion3.png')
    .expect(Selector('#player3colors').childElementCount).eql(1)
    .expect(Selector('#player3colors').child(0).getAttribute('src')).eql('images/pion6.png')
    .expect(Selector('#player4colors').childElementCount).eql(1)
    .expect(Selector('#player4colors').child(0).getAttribute('src')).eql('images/pion2.png')
    .expect(Selector('#player5colors').childElementCount).eql(1)
    .expect(Selector('#player5colors').child(0).getAttribute('src')).eql('images/pion4.png')
    .expect(Selector('#player6colors').childElementCount).eql(1)
    .expect(Selector('#player6colors').child(0).getAttribute('src')).eql('images/pion5.png')
  await t // 2 joueurs
    .click('#mode')
    .click(Selector('#mode').find('option').withText('2 joueurs'))
    .expect(Selector('#player1').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player2').getStyleProperty('display')).eql('inline-block')
    .expect(Selector('#player3').getStyleProperty('display')).eql('none')
    .expect(Selector('#player4').getStyleProperty('display')).eql('none')
    .expect(Selector('#player5').getStyleProperty('display')).eql('none')
    .expect(Selector('#player6').getStyleProperty('display')).eql('none')
    .expect(Selector('#color_choice').getStyleProperty('display')).eql('inline')
    .expect(Selector('#player1colors').childElementCount).eql(1)
    .expect(Selector('#player1colors').child(0).getAttribute('src')).eql('images/pion1.png')
    .expect(Selector('#player2colors').childElementCount).eql(1)
    .expect(Selector('#player2colors').child(0).getAttribute('src')).eql('images/pion2.png')
});

test('Vérifier le nom d\'un joueur', t => {

});

// var clicks = { // coordonnées des cases à cliquer
//   2: { // nombre de joueurs
//     1: // nombre de couleurs
//       [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11]],
//     2: [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11],[4,4],[6,6],[10,22],[10,18],[4,0],[8,16],[12,24],[12,8],[6,4],[6,8],[11,19],[7,7],[4,2],[6,4],[11,23],[9,13],[5,3],[9,15],[11,21],[11,17],[6,6],[12,24],[12,18],[10,8],[6,2],[10,14],[9,21],[5,9],[6,4],[6,16],[9,13],[9,9],[5,1],[9,21],[10,8],[6,4],[9,15],[11,21],[12,8],[6,2],[4,6],[12,18],[10,20],[4,6],[10,14],[10,22],[5,9],[5,1],[6,16],[10,20],[12,20],[12,16],[7,3],[7,5],[10,18],[10,6],[7,5],[9,15],[12,16],[8,4],[4,10],[12,10],[12,22],[4,2],[8,16],[8,20],[5,1],[4,0],[5,5],[9,17],[7,7],[5,1],[6,14],[6,16],[10,6],[6,6],[4,14],[10,8],[9,9],[5,5],[9,15],[9,19],[11,17],[11,15],[9,21],[11,23],[11,15],[7,3],[9,17],[11,19],[6,6],[4,4],[6,8],[7,9],[6,2],[5,3],[7,9],[13,15],[8,4],[6,2],[5,11],[13,11]]
//   }
// }
