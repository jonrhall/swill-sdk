'use strict';

const stepInterface = require('../core/resource-interface')({
  name: 'steps',
  socketEvents: ['UPDATE_ALL_STEPS']
});

module.exports = stepInterface;
