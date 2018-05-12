'use strict';

const socketClient = require('./socket-client'),
  httpClient = require('./http-client');

// Generate a CraftBeerPi resource. The name is plural version of the resource name.
module.exports = function generateResource(name, socketEvents = [], pluralIndex = true){
  const getResourcesName = `get${capitalize(name)}`,
    baseName = name.slice(0, name.length-1),
    getTypesName = `get${capitalize(baseName)}Types`,
    sysDumpIndex = pluralIndex ? name : baseName,
    onUpdateFns = [],
    cachedData = {};

  // For any of the registered socket events, register listeners and make sure
  // to update any consumers of changes to the data models in the socket updates.
  socketEvents.forEach(event => socketClient.on(
    event,
    data => onUpdateFns.forEach(fn => fn(event, data))
  ));

  // Generate and return the resource object itself.
  return {
    // Get all the resources
    [getResourcesName]: getResources,
    // Get all the types of the resource,
    [getTypesName]: getTypes,
    // Register a listener for updates to resources.
    onUpdate: fn1 => {
      onUpdateFns.push(fn1);

      // Return a function that allows the caller to unsubscribe from listening.
      return () => {
        onUpdateFns.some((fn2,i) => {
          if(fn1 === fn2){
            onUpdateFns.splice(i,1);
            return true;
          }
        });
      };
    }
  };

  // Get the list of resources.
  async function getResources(){
    let resources = await httpClient.getSystemDump();

    // Assign the resources list to the cache in such a way that we can hold onto the reference,
    // which allows one instance of the resources updating to modify another's. Another unfortunate
    // side-effect of CraftBeerPi's inconsistencies is that "steps" is the only base resource
    // type in the entire app to not return an object as its list of resources type--it returns
    // an array--so we handle that here too.
    cachedData.resources = name === 'steps' ?
      resources[sysDumpIndex] :
      toArray(resources[sysDumpIndex]);

    // Assign the setState function to each resource object
    cachedData.resources.forEach(resource => resource.__proto__.setState = setState.bind(null, resource));

    return cachedData.resources;
  }

  // Get the possible types of resource that are available. Every resource has a type.
  async function getTypes(){
    const specialCases = {
        kettle: 'controller_types',
        fermenter: 'fermentation_controller_types'
      },
      typeIndex = specialCases[baseName] || `${baseName}_types`;

    return toArray((await httpClient.getSystemDump())[typeIndex]);
  }

  // This set state function operates on a resource object in-memory, but it also supports using it in an
  // asyncronous matter, resolving to the updated resource object as an output once it is returned from the server.
  async function setState(resource, newSettings){
    const updatedResource = await httpClient.put(`/${baseName}/${resource.id}`, Object.assign({}, resource, newSettings));

    // Re-assign the resource object in-memory to make sure we're consistent with the server's model.
    Object.assign(resource, updatedResource);

    // CraftBeerPi can be inconsistent in when it updates its resources via websocket and when it
    // updates its resources only via HTTP response. This function makes it so that a user can rely
    // on the 'onUpdate' function to truly give them all the resource object updates they need.
    onUpdateFns.forEach(fn => fn(`UPDATE_${baseName.toUpperCase()}`, resource));

    return resource;
  }
};

// Private methods that each generated resource will not have access to. Just helper methods.

function toArray(obj){
  return Object.keys(obj).map(index => obj[index]);
}

function capitalize(str){
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
