'use strict';

const kettleInterface = require('../core/resource-interface')(
  'kettles',
  [ 'UPDATE_KETTLE', 'UPDATE_KETTLE_TARGET_TEMP' ],
  true
);

module.exports = kettleInterface;
