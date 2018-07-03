const socketClient = require('./socket-client');
const httpClient = require('./http-client');

// CraftBeerPi can be inconsistent in when it updates its resources via websocket and when it
// updates its resources only via HTTP response. This function makes it so that a user can rely
// on the 'onUpdate' function to truly give them all the resource object updates they need.
const broadcastUpdate = (fns, ...params) => fns.forEach(fn => fn(...params));

// Get the list of resources.
const getResources = systemDumpIndex => async () => {
  const resources = await httpClient.getSystemDump();

  // Another unfortunate side-effect of CraftBeerPi's inconsistencies is that "steps" is the only
  // base resource type in the entire app to not return an object as its list of resources type--
  // it returns an array--so we handle that here.
  const list = Array.isArray(resources[systemDumpIndex]) ?
    resources[systemDumpIndex] :
    Object.values(resources[systemDumpIndex]);

  return list;
};

// Get the possible types of resource that are available. Every resource has a type.
const getTypes = baseName => async () => {
  const specialCases = {
      kettle: 'controller_types',
      fermenter: 'fermentation_controller_types'
    },
    typeIndex = specialCases[baseName] || `${baseName}_types`;

  return Object.values((await httpClient.getSystemDump())[typeIndex]);
};

// Create a resource (POST request)
const createResource = (baseName, template, onUpdateFns) => async (resource = {}) => {
  const newResource = await httpClient.post(
    `/${baseName}/`, 
    Object.assign({}, template, resource)
  );

  broadcastUpdate(onUpdateFns, `UPDATE_${baseName.toUpperCase()}`, newResource);
  return newResource;
};

// Modify a resource (PUT request)
const modifyResource = (baseName, onUpdateFns) => async resource => {
  const updatedResource = await httpClient.put(
    `/${baseName}/${resource.id}`, 
    resource
  );

  // Only update the resource if there was an update from the API call.
  if (updatedResource) {
    broadcastUpdate(onUpdateFns, `UPDATE_${baseName.toUpperCase()}`, updatedResource);
  }

  return updatedResource;
};

// Delete a resource (DELETE request)
const deleteResource = (baseName, onUpdateFns) => async ({ id }) => {
  await httpClient.delete(`/${baseName}/${id}`);
  broadcastUpdate(onUpdateFns, `DELETE_${baseName.toUpperCase()}`);
  return {id};
};

// Allow SDK clients to listen for updates to a given resource type.
const subscribe = fns => fn => {
  fns.push(fn);

  // Return a function that allows the caller to unsubscribe from listening.
  return unsubscribe(fns, fn);
};

// Allow SDK clients to unsubscribe from updates to a given resource type.
const unsubscribe = (fns, fn1) => () => {
  fns.some((fn2,i) => {
    if(fn1 === fn2){
      fns.splice(i,1);
      return true;
    }
  });
};

// Capitalize a given string
const capitalize = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

// Generate a CraftBeerPi resource. The name is plural version of the resource name.
module.exports = function generateResource({ name, socketEvents = [], template = {}, pluralIndex = true }){
  const baseName = name.slice(0, name.length-1);
  const capitalizedBaseName = capitalize(baseName);
  const sysDumpIndex = pluralIndex ? name : baseName;
  const onUpdateFns = [];

  // For any of the registered socket events, register listeners and make sure
  // to update any consumers of changes to the data models in the socket updates.
  socketEvents.forEach(event => socketClient.on(
    event,
    data => onUpdateFns.forEach(fn => fn(event, data))
  ));

  // Return the resource object itself.
  return {
    // Get all the resources
    [`get${capitalize(name)}`]: getResources(sysDumpIndex),
    // Get all the types of the resource,
    [`get${capitalizedBaseName}Types`]: getTypes(baseName),
    // Create a resource
    [`create${capitalizedBaseName}`]: createResource(baseName, template, onUpdateFns),
    // Modify a resource
    [`modify${capitalizedBaseName}`]: modifyResource(baseName, onUpdateFns),
    // Delete a resource
    [`delete${capitalizedBaseName}`]: deleteResource(baseName, onUpdateFns),
    // Register a listener for updates to resources.
    onUpdate: subscribe(onUpdateFns)
  };
};