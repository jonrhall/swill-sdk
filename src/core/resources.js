//const actors  = require('../resources/actors');
//const kettles = require('../resources/kettles');

// TODO: dynamic import of all resources in the 'resources' folder

const generateResource = require('./resource-interface'),
  actors = generateResource('actors', [ 'SWITCH_ACTOR' ]),
  kettles = generateResource('kettles', [ 'UPDATE_KETTLE', 'UPDATE_KETTLE_TARGET_TEMP' ], false),
  fermenters = generateResource('fermenters', ['UPDATE_FERMENTER_TARGET_TEMP', 'UPDATE_FERMENTER_BREWNAME', 'UPDATE_FERMENTER'], false),
  sensors = generateResource('sensors', [ 'SENSOR_UPDATE' ]),
  steps = generateResource('steps', [ 'UPDATE_ALL_STEPS' ]);

module.exports = { actors, kettles, fermenters, sensors, steps };
