'use strict';

const kettleInterface = require('../core/resource-interface')({
  name: 'kettles',
  socketEvents: ['UPDATE_KETTLE', 'UPDATE_KETTLE_TARGET_TEMP'],
  pluralIndex: false
});

module.exports = kettleInterface;
