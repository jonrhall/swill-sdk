"use strict";

// The default entry point for the entire SDK
module.exports = function SwillSDK(config){
  const cbpiOverrides = require('./core/cbpi-overrides');

  global.SDK_CONFIG = config || {};

  return {
    socketClient: require('./core/socket-client'),
    httpClient: cbpiOverrides(require('./core/http-client')),
    resources: require('./core/resources')
  };
};
