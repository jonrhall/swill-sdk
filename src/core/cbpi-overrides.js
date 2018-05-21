'use strict';

// CraftBeerPi requires a certain amount of overrides to its API routes to
// properly set certain properties on certain resources. This allows CraftBeerPi
// to be a modular dependency of Swill SDK and allows Swill to be opinionated
// about the interface clients use to talk to a CBPi-like server.
module.exports = function overrides(sdk){
  actorOverrides(sdk);
  kettleOverrides(sdk);

  return sdk;
};

function actorOverrides(sdk){
  const httpPut = sdk.httpClient.put;

  sdk.httpClient.put = async function actorHttpPutOverride(route, data) {
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
}

function kettleOverrides(sdk){
  const httpPut = sdk.httpClient.put;

  sdk.httpClient.put = async function kettleHttpPutOverride(route, data) {
    // This isn't a particularly clean solution, but what saves it is the fact that the system dump
    // is cached. It's also the only practical way of getting an up to date system representation.
    const systemDump = await sdk.httpClient.getSystemDump();
    let resourceFns = [];

    // Kettle routes
    if(/^\/kettle\/\d+$/.test(route)){
      const kettle = systemDump.kettle[data.id];

      // If the state (on/off) settings aren't the same, toggle the state
      if(kettle.state !== data.state){
        // Only toggle the power if the new setting is valid
        if(data.state === true || data.state === false){
          resourceFns.push(sdk.httpClient.post.bind(null, `${route}/automatic`));
          kettle.state = data.state;
        } else {
          throw new Error('Invalid kettle state setting');
        }
      }

      // If the target temp settings aren't the same, set the target temp.
      if(kettle.target_temp !== data.target_temp){
        resourceFns.push(sdk.httpClient.post.bind(null, `${route}/targettemp/${data.target_temp}`));
        kettle.target_temp = data.target_temp;
      }

      // If the objects still are different after applying the power
      // and state changes, add a put operation.
      if(JSON.stringify(kettle) !== JSON.stringify(data)){
        await httpPut(route,data);
      }

      // Only after the potential PUT operation should the custom routes be run
      resourceFns.forEach(async fn => await fn());

      return (await sdk.httpClient.getSystemDump()).kettle[kettle.id];
    }

    return await httpPut(route,data);
  };
}
