"use strict";

// The default entry point for the entire SDK
module.exports = function SwillSDK(config){
  const cbpiOverrides = require('./core/cbpi-overrides');
  global.SWILL_SDK_CONFIG = config || {};

  // Merge in default properties
  global.SWILL_SDK_CONFIG = Object.assign({
    server: 'http://localhost',
    port: 5000,
    cacheInterval: 5000
  }, global.SWILL_SDK_CONFIG);

  // Override the normal SDK with CraftBeerPi-specific logic.
  return cbpiOverrides({
    socketClient: require('./core/socket-client'),
    httpClient: require('./core/http-client'),
    resources: require('./core/resources'),
    config: require('./core/config'),
    logs: require('./core/logs')
  });
};
