const actorInterface = require('../core/resource-interface')({
  name: 'actors',
  socketEvents: ['SWITCH_ACTOR'],
  template: {
    config: {},
    hide: false,
    name: 'NewActor',
    type: 'Dummy'
  }
});

const httpClient = require('../core/http-client');

// Add a toggle timer action for the Actor resource, to support the route CPBi provides
actorInterface.setTimer = async (actor, secs) => {
  return await httpClient.post(`/actor/${actor.id}/toggle/${secs}`);
};

module.exports = actorInterface;
