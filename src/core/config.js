'use strict';

const httpClient = require('./http-client'),
  socketClient = require('./socket-client'),
  onUpdateFns = [];

// Register the config resource to listen for any updates from the websocket connection
socketClient.on('UPDATE_CONFIG', data => onUpdateFns.forEach(fn => fn('UPDATE_CONFIG', data)));

module.exports = {
  getConfig,
  onUpdate: fn => onUpdateFns.push(fn)
};

// Get the config object for the entire CBPi app
async function getConfig(){
  const config =  (await httpClient.getSystemDump()).config;

  Object.values(config).forEach(parameter =>
    parameter.setValue = setValue.bind(null, parameter));

  return config;
}

// Set the value for a given parameter within the config object
async function setValue(parameter, value){
  // Merge the new settings with the parameter object itself into a new copy
  const paramCopy = Object.assign({}, parameter, {value});

  // Delete the custom function that exists on the parameter copy
  delete paramCopy.setValue;

  const updatedParam = await httpClient.put(`/config/${paramCopy.name}`, paramCopy);

  // Merge the updated parameter into the copy in memory
  Object.assign(parameter, updatedParam);

  // CraftBeerPi can be inconsistent in when it updates its resources via websocket and when it
  // updates its resources only via HTTP response. This function makes it so that a user can rely
  // on the 'onUpdate' function to truly give them all the resource object updates they need.
  onUpdateFns.forEach(fn => fn('UPDATE_CONFIG', parameter));

  return parameter;
}
