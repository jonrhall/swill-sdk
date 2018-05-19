'use strict';

const fermenterInterface = require('../core/resource-interface')({
  name: 'fermenters',
  socketEvents: ['UPDATE_FERMENTER_TARGET_TEMP', 'UPDATE_FERMENTER_BREWNAME', 'UPDATE_FERMENTER'],
  pluralIndex: false,
  template: {
    name: 'NewFermenter',
    heater: '',
    cooler: '',
    sensor: '',
    sensor2: '',
    sensor3: '',
    logic: ''
  }
});

module.exports = fermenterInterface;
