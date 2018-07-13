'use strict';

const httpClient = require('./http-client');
const onUpdateFns = [];

// Get the config object for the entire CBPi app.
async function getLogs(){
  return Object.values(await httpClient.get('/logs/'));
}

// Get a specific log file
async function getLogFile(log){
  return await httpClient.get(`/logs/${log}`);
}

// Set the value for a given parameter within the config object.
async function deleteLog(log){
  // Edit the specified parameter by sending a PUT to the API.
  var response = await httpClient.delete(`/logs/${log}`);

  // CraftBeerPi can be inconsistent in when it updates its resources via websocket and when it
  // updates its resources only via HTTP response. This function makes it so that a user can rely
  // on the 'onUpdate' function to truly give them all the resource object updates they need.
  onUpdateFns.forEach(fn => fn('DELETE_LOG', log));

  return response;
}

// Allow clients to register listeners for when the config object updates.
const onUpdate = fn => onUpdateFns.push(fn);

module.exports = {
  getLogs,
  getLogFile,
  deleteLog,
  onUpdate
};
