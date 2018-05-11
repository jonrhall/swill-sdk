const generateResource = require('./resource-interface'),
  resources = [
    {
      name: 'actors',
      events: [ 'SWITCH_ACTOR' ]
    },
    {
      name: 'kettles',
      events: [ 'UPDATE_KETTLE', 'UPDATE_KETTLE_TARGET_TEMP' ],
      notPlural: true
    },
    {
      name: 'fermenters',
      events: ['UPDATE_FERMENTER_TARGET_TEMP', 'UPDATE_FERMENTER_BREWNAME', 'UPDATE_FERMENTER'],
      notPlural: true
    },
    {
      name: 'sensors',
      events: [ 'SENSOR_UPDATE' ]
    },
    {
      name: 'steps',
      events: [ 'UPDATE_ALL_STEPS' ]
    }
  ];

// Generate a resource object for each resource config
resources.forEach(resource =>
  module.exports[resource.name] = generateResource(
    resource.name,
    resource.events,
    resource.notPlural
  )
);

// Also export the config resource, which is a special case
module.exports.config = require('../resources/config');
