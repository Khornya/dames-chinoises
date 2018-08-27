var browserstack = require('browserstack-local');

exports.config = {
  user: 'archermarine1',
  key: '1Bqxw29yPnwHEvH4udTd',

  specs: [
      './tests/ui/*.js'
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
    browser: 'chrome',
    'browserstack.local': true,
  },{
    browser: 'firefox',
    'browserstack.local': true,
  },{
    browser: 'internet explorer',
    'browserstack.local': true,
  },{
    browser: 'safari',
    'browserstack.local': true,
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
