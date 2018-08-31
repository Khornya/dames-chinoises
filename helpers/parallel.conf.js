var browserstack = require('browserstack-local');

exports.config = {
  user: 'archermarine1',
  key: '1Bqxw29yPnwHEvH4udTd',

  specs: [
      './tests/ui/home.test.js',
      './tests/ui/game.test.js',
      './tests/ui/ia.test.js'
  ],

  framework: 'mocha',

  mochaOpts: {
      ui: 'bdd',
      timeout: 999999
  },

  browserstackOpts: {
    'log-file': './logs/browserstack/local.log'
  },

  capabilities: [{
    browserName: 'chrome',
    'browser_version': '64.0',
    'browserstack.local': true,
    'browserstack.console': 'verbose'
  },{
    browserName: 'firefox',
    'browser_version': '58.0',
    'browserstack.local': true,
    'browserstack.console': 'verbose'
  },{
    browserName: 'internet explorer',
    'browser_version': '11.0',
    'browserstack.local': true,
    'browserstack.console': 'verbose'
  },{
    browserName: 'safari',
    'browser_version': '11.0',
    'browserstack.local': true,
    'browserstack.console': 'verbose'
  },{
    browserName: 'edge',
    'browser_version': '16.0',
    'browserstack.local': true,
    'browserstack.console': 'verbose'
  }],

  maxInstances: 10,

  // Code to start browserstack local before start of test
  onPrepare: function (config, capabilities) {
    console.log("Connecting local");
    return new Promise(function(resolve, reject){
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({'key': exports.config.key }, function(error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');
        resolve();
      });
    });
  },

  // Code to stop browserstack local after end of test
  onComplete: function (capabilties, specs) {
    exports.bs_local.stop(function() {});
    process.kill(exports.bs_local.pid);
    console.log('Disconnected.')
  }
}

// Code to support common capabilities
exports.config.capabilities.forEach(function(caps){
  for(var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});
