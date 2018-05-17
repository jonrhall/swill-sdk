'use strict';

const stepInterface = require('../core/resource-interface')(
  'steps',
  [ 'UPDATE_ALL_STEPS' ]
);

module.exports = stepInterface;
