'use strict';

const actorInterface = require('../core/resource-interface')(
  'actors',
  [ 'SWITCH_ACTOR' ]
);

module.exports = actorInterface;
