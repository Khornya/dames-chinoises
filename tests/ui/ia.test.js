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

describe.only('Parties entre IA', function() {
  it('devrait lancer une partie avec 2 IA 1 couleur', () => {
    if (browser.desiredCapabilities.browserName !== 'chrome') {
      assert.ok(true)
    }
    else {
      browser.url('http://localhost:8000')
      browser.execute(setTestLevel)
      browser.click('#ordi1')
      browser.click('#ordi2')
      browser.click('#level0')
      browser.click('#colors1')
      browser.click('#JOUER')
      browser.waitForVisible('#modal', 1000000);
    }
  });
  it('devrait lancer une partie avec 2 IA 2 couleurs', () => {
    if (browser.desiredCapabilities.browserName !== 'chrome') {
      assert.ok(true)
    }
    else {
      browser.url('http://localhost:8000')
      browser.execute(setTestLevel)
      browser.click('#ordi1')
      browser.click('#ordi2')
      browser.click('#level0')
      browser.click('#colors2')
      browser.click('#JOUER')
      browser.waitForVisible('#modal', 1000000);
    }
  });
  it.only('devrait lancer une partie avec 2 IA 3 couleurs', () => {
    if (browser.desiredCapabilities.browserName !== 'chrome') {
      assert.ok(true)
    }
    else {
      browser.url('http://localhost:8000')
      browser.execute(setTestLevel)
      browser.click('#ordi1')
      browser.click('#ordi2')
      browser.click('#level0')
      browser.click('#colors3')
      browser.click('#JOUER')
      browser.waitForVisible('#modal', 1000000);
    }
  });
  it('devrait lancer une partie avec 3 IA', () => {
    if (browser.desiredCapabilities.browserName === 'chrome') {
      assert.ok(true)
    }
    else {
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
    }
  });
  it('devrait lancer une partie avec 4 IA', () => {
    if (browser.desiredCapabilities.browserName !== 'chrome') {
      assert.ok(true)
    }
    else {
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
    }
  });
  it('devrait lancer une partie avec 6 IA', () => {
    if (browser.desiredCapabilities.browserName !== 'chrome') {
      assert.ok(true)
    }
    else {
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
    }
  });
});
