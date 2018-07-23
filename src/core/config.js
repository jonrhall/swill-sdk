'use strict';

const httpClient = require('./http-client');
const socketClient = require('./socket-client');
const onUpdateFns = [];

// Register the config resource to listen for any updates from the websocket connection.
socketClient.on('UPDATE_CONFIG', data => onUpdateFns.forEach(fn => fn('UPDATE_CONFIG', data)));

// Get the config object for the entire CBPi app.
async function getConfig(){
  return Object.values((await httpClient.getSystemDump()).config);
}

// Set the value for a given parameter within the config object.
async function setValue(parameter, value){
  // Merge the new settings with the parameter object itself into a new copy.
  const newParam = Object.assign({}, parameter, { value });

  // Edit the specified parameter by sending a PUT to the API.
  const updatedParam = await httpClient.put(`/config/${parameter.name}`, newParam);

  // CraftBeerPi can be inconsistent in when it updates its resources via websocket and when it
  // updates its resources only via HTTP response. This function makes it so that a user can rely
  // on the 'onUpdate' function to truly give them all the resource object updates they need.
  onUpdateFns.forEach(fn => fn('UPDATE_CONFIG', updatedParam));

  return updatedParam;
}

// Allow clients to register listeners for when the config object updates.
const onUpdate = fn => onUpdateFns.push(fn);

module.exports = {
  getConfig,
  setValue,
  onUpdate
};
