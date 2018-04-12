"use strict";

// The default entry point for the entire SDK
module.exports = function SwillSDK(config){
  global.SDK_CONFIG = config || {};

  return {
    socketClient: require('./core/socket-client'),
    httpClient: require('./core/http-client'),
    resources: require('./core/resources')
  };
};
