const generateResource = require('./resource-interface'),
  actors = generateResource('actors', [ 'SWITCH_ACTOR' ]),
  kettles = generateResource('kettles', [ 'UPDATE_KETTLE', 'UPDATE_KETTLE_TARGET_TEMP' ], false),
  fermenters = generateResource('fermenters', ['UPDATE_FERMENTER_TARGET_TEMP', 'UPDATE_FERMENTER_BREWNAME', 'UPDATE_FERMENTER'], false),
  sensors = generateResource('sensors', [ 'SENSOR_UPDATE' ]),
  steps = generateResource('steps', [ 'UPDATE_ALL_STEPS' ]),
  config = require('../resources/config');

module.exports = { actors, kettles, fermenters, sensors, steps, config };
