'use strict';

const fermenterInterface = require('../core/resource-interface')(
  'fermenters',
  ['UPDATE_FERMENTER_TARGET_TEMP', 'UPDATE_FERMENTER_BREWNAME', 'UPDATE_FERMENTER'],
  true
);

module.exports = fermenterInterface;
