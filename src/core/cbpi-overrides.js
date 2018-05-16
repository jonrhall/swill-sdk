'use strict';

// CraftBeerPi requires a certain amount of overrides to its API routes to
// properly set certain properties on certain resources. This allows CraftBeerPi
// to be a modular dependency of Swill SDK and allows Swill to be opinionated
// about the interface clients use to talk to a CBPi-like server.
module.exports = function overrides(sdk){
  actorOverrides(sdk);

  return sdk;
};

function actorOverrides(sdk){
  const httpPut = sdk.httpClient.put;

  sdk.httpClient.put = async (route, data) => {
    // This isn't a particularly clean solution, but what saves it is the fact that the system dump
    // is cached. It's also the only practical way of getting an up to date system representation.
    const systemDump = await sdk.httpClient.getSystemDump();

    // Actor routes
    if(/^\/actor\/\d+$/.test(route)){
      const actor = systemDump.actors[data.id];
      let resourceFns = [];

      // If the state (on/off) settings aren't the same, toggle the state
      if(actor.state !== data.state){
        // Only toggle the power if the new setting is valid
        if(data.state === 0 || data.state === 1){
          resourceFns.push(sdk.httpClient.post.bind(null, `${route}/toggle`));
          actor.state = data.state;
        } else {
          throw new Error('Invalid actor state setting');
        }
      }

      // If the power settings aren't the same, set the power capacity
      if(actor.power !== data.power){
        resourceFns.push(sdk.httpClient.post.bind(null, `${route}/power/${data.power}`));
        actor.power = data.power;
      }

      // If the objects still are different after applying the power
      // and state changes, add a put operation.
      if(JSON.stringify(actor) !== JSON.stringify(data)){
        await httpPut(route,data);
      }

      // Only after the potential PUT operation should the custom routes be run
      resourceFns.forEach(async fn => await fn());

      return (await sdk.httpClient.getSystemDump()).actors[actor.id];
    }

    return await httpPut(route,data);
  };

  // Add a toggle timer action for the Actor resource, to support the route CPBi provides
  sdk.resources.actors.setTimer = async (actor, secs) => {
    return await sdk.httpClient.post(`/actor/${actor.id}/toggle/${secs}`);
  };
}
