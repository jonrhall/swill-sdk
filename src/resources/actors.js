"use strict";

const socketClient = require('../core/socket-client'),
  httpClient = require('../core/http-client'),
  socketEvents = [ 'SWITCH_ACTOR' ];

let onUpdateFns = [];

// For any of the registered socket events, register listeners and make sure
// to update and consumers of changes to the data models in the socket updates.
socketEvents.forEach(event => socketClient.on(
  event,
  data => onUpdateFns.forEach(fn => fn(event, data))
));

module.exports = {
  // Get all the actor resources
  getActors: async() => {
    return (await httpClient.get('/system/dump')).actors;
  },
  // Register listeners for updates to actor resources
  onUpdate: fn => onUpdateFns.push(fn)
};
