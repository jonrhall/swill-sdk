'use strict';

const sensorInterface = require('../core/resource-interface')(
  'sensors',
  [ 'SENSOR_UPDATE' ]
);

module.exports = sensorInterface;
