'use strict';

const sensorInterface = require('../core/resource-interface')({
  name: 'sensors',
  socketEvents: [ 'SENSOR_UPDATE' ]
});

module.exports = sensorInterface;
