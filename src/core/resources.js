// Generate a resource object for each resource config
[
  'actors',
  'fermenters',
  'kettles',
  'logs',
  'messages',
  'plugins',
  'sensors',
  'steps'
].forEach(resource => 
  module.exports[resource] = require(`../resources/${resource}`));
