import test from 'ava';

import * as Client from './client.js';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

test.only.cb('afficher / masquer le texte', t => {
  t.plan(2);
  const dom = new JSDOM(`<script src="client.js"></script><div id="seeMoreDiv" style="display:none">Des explications très intéressantes</div><button id="seeMoreButton" onclick="Client.seeMore()">Voir plus</button>`, { runScripts: "dangerously" });
  setTimeout(() => {
    dom.window.document.getElementById('seeMoreButton').click();
    t.is(dom.window.document.getElementById('seeMoreDiv').style.display, 'block');
    dom.window.document.getElementById('seeMoreButton').click();
    t.is(dom.window.document.getElementById('seeMoreDiv').style.display, 'none');
  }, 5000);
});
