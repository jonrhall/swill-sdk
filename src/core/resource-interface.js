'use strict';

const socketClient = require('./socket-client'),
  httpClient = require('./http-client');

// Generate a CraftBeerPi resource. The name is plural version of the resource name.
module.exports = function generateResource(config){
  // Set some resource defaults
  config.socketEvents = config.socketEvents || [];
  config.pluralIndex = config.pluralIndex || true;
  config.template = config.template || {};

  const getResourcesName = `get${capitalize(config.name)}`,
    baseName = config.name.slice(0, config.name.length-1),
    getTypesName = `get${capitalize(baseName)}Types`,
    createResourceName = `create${capitalize(baseName)}`,
    sysDumpIndex = config.pluralIndex ? config.name : baseName,
    onUpdateFns = [],
    cachedData = {};

  // The base resource type for the each resource instance. Copies object properties and wraps it with
  // some useful helper methods to manage state.
  class Resource {
    constructor(obj){
      Object.keys(obj).forEach(key => {
        this[key] = obj[key];
      });
    }

    // Delete a resource of a given type.
    async remove(){
      await httpClient.delete(`/${baseName}/${this.id}`);
      broadcastUpdate(`DELETE_${baseName.toUpperCase()}`);
    }

    // This set state function operates on a resource object in-memory, but it also supports using it in an
    // asyncronous matter, resolving to the updated resource object as an output once it is returned from the server.
    async setState(newSettings){
      const copy = Object.assign({}, this, newSettings);
      const updatedResource = await httpClient.put(`/${baseName}/${this.id}`, copy);

      // Re-assign the resource object in-memory to make sure we're consistent with the server's model.
      Object.assign(this, updatedResource);

      broadcastUpdate(`UPDATE_${baseName.toUpperCase()}`, this);

      return this;
    }
  }

  // For any of the registered socket events, register listeners and make sure
  // to update any consumers of changes to the data models in the socket updates.
  config.socketEvents.forEach(event => socketClient.on(
    event,
    data => onUpdateFns.forEach(fn => fn(event, data))
  ));

  // Generate and return the resource object itself.
  return {
    // Get all the resources
    [getResourcesName]: getResources,
    // Get all the types of the resource,
    [getTypesName]: getTypes,
    // Create a resource
    [createResourceName]: createResource,
    // Register a listener for updates to resources.
    onUpdate
  };

  // Get the list of resources.
  async function getResources(){
    let resources = await httpClient.getSystemDump(),
      //Another unfortunate side-effect of CraftBeerPi's inconsistencies is that "steps" is the only
      // base resource type in the entire app to not return an object as its list of resources type--
      // it returns an array--so we handle that here.
      list = config.name === 'steps' ? resources[sysDumpIndex] : toArray(resources[sysDumpIndex]);

    // Assign the resources list to the cache in such a way that we can hold onto the reference.
    cachedData.resources = list.map(resource => {
      return new Resource(resource);
    });

    return cachedData.resources;
  }

  // Get the possible types of resource that are available. Every resource has a type.
  async function getTypes(baseName){
    const specialCases = {
        kettle: 'controller_types',
        fermenter: 'fermentation_controller_types'
      },
      typeIndex = specialCases[baseName] || `${baseName}_types`;

    return toArray((await httpClient.getSystemDump())[typeIndex]);
  }

  // Create a resource of a given type based on a template.
  async function createResource(resource){
    const newResource = await httpClient.post(`/${baseName}/`, Object.assign({}, config.template, resource));

    broadcastUpdate(`UPDATE_${baseName.toUpperCase()}`, newResource);

    return newResource;
  }

  // Allow SDK clients to listen for updates to a given resource.
  function onUpdate(fn1){
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

  // CraftBeerPi can be inconsistent in when it updates its resources via websocket and when it
  // updates its resources only via HTTP response. This function makes it so that a user can rely
  // on the 'onUpdate' function to truly give them all the resource object updates they need.
  function broadcastUpdate(eventName, resource){
    onUpdateFns.forEach(fn => fn(eventName, resource));
  }
};

// Private methods that each generated resource will not have access to. Just helper methods, no context.

function toArray(obj){
  return Object.keys(obj).map(index => obj[index]);
}

function capitalize(str){
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
