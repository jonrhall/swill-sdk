// Generate a resource object for each resource config
[
  'actors',
  'fermenters',
  'kettles',
  'messages',
  'sensors',
  'steps'
].forEach(resource => 
  module.exports[resource] = require(`../resources/${resource}`));
