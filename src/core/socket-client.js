const io = require('socket.io-client');

// The default assumes the socket-client exists on the same IP address as CraftBeerPi.
const SOCKET_ADDRESS = `${global.SWILL_SDK_CONFIG.server}:${global.SWILL_SDK_CONFIG.port}`;

// Initialize the socket.io-client. '/brew' is the endpoint the CBPi socket.io server listens on.
const socket = io(SOCKET_ADDRESS + '/brew');

// These are all of the events that CraftBeerPi3 admits.
const events = ['connect', 'disconnect', "SWITCH_ACTOR", "SENSOR_UPDATE", "UPDATE_KETTLE", "UPDATE_ALL_STEPS", "NOTIFY", "UPDATE_KETTLE_TARGET_TEMP", "UPDATE_FERMENTER_TARGET_TEMP", "UPDATE_FERMENTER_BREWNAME", "UPDATE_FERMENTER", "UPDATE_CONFIG", "MESSAGE"];

// Keep track of all socket listeners
const listeners = {};

// Register a function to handle each known socket event. When a known event occurs,
// call any listeners that may have registered themselves to receive that event.
events.forEach(event =>
  socket.on(event, data =>
    (listeners[event] || []).forEach(listenFn => listenFn(data))));

module.exports = {
  on: registerListener
};

// Register a listener for a given socket event.
function registerListener(event, fn){
  if(!listeners[event]){
    listeners[event] = [ fn ];
  } else{
    listeners[event].push(fn);
  }
}

