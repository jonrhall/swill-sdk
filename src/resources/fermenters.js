'use strict';

const fermenterInterface = require('../core/resource-interface')({
  name: 'fermenters',
  socketEvents: ['UPDATE_FERMENTER_TARGET_TEMP', 'UPDATE_FERMENTER_BREWNAME', 'UPDATE_FERMENTER'],
  pluralIndex: false
});

module.exports = fermenterInterface;
