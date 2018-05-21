'use strict';

const sensorInterface = require('../core/resource-interface')({
    name: 'sensors',
    socketEvents: [ 'SENSOR_UPDATE' ],
    template: {
      name: 'NewSensor',
      hide: false,
      type: 'DummyTempSensor',
      config: {
        temp: 0
      }
    }
  }),
  httpClient = require('../core/http-client');

// Add a get method for returning a list of detected and available sensors
sensorInterface.getSensorInstances = async () => {
  return Object.values((await httpClient.getSystemDump()).sensor_instances);
};

module.exports = sensorInterface;
