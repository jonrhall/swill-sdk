'use strict';

const httpClient = require('../core/http-client');
const onUpdateFns = [];

// Get the config object for the entire CBPi app.
async function getLogs(){
  return Promise.all(
    Object.values(await httpClient.get('/logs/'))
      .map(logName => getLogDetails(logName))
  );
}

// Get a specific log file
async function getLogFile(log){
  return await httpClient.get(`/logs/download/${log}`);
}

// Get the file details of a specific log
async function getLogDetails(name){
  const headers = (await httpClient.head(`/logs/download/${name}`)).headers.entries();
  const details = {
    name,
    href: `${httpClient.httpAddress}/api/logs/download/${name}`
  };

  // `headers` is an Iterator and has to be parsed into a hash
  for (let keypair of headers) {
    details[keypair[0]] = keypair[1];
  }

  return details;
}

// Set the value for a given parameter within the config object.
async function deleteLog(log){
  // Remove the specified log by sending a PUT to the API.
  await httpClient.delete(`/logs/${log}`);

  // CraftBeerPi can be inconsistent in when it updates its resources via websocket and when it
  // updates its resources only via HTTP response. This function makes it so that a user can rely
  // on the 'onUpdate' function to truly give them all the resource object updates they need.
  onUpdateFns.forEach(fn => fn('DELETE_LOG', log));

  return { name: log };
}

// Allow clients to register listeners for when the config object updates.
const onUpdate = fn => onUpdateFns.push(fn);

module.exports = {
  getLogs,
  getLogFile,
  getLogDetails,
  deleteLog,
  onUpdate
};
