"use strict";

// The default entry point for the entire SDK
module.exports = function SwillSDK(config){
  const cbpiOverrides = require('./core/cbpi-overrides');
  global.SDK_CONFIG = config || {};

  // Override the normal SDK with CraftBeerPi-specific logic.
  return cbpiOverrides({
    socketClient: require('./core/socket-client'),
    httpClient: require('./core/http-client'),
    resources: require('./core/resources')
  });
};
