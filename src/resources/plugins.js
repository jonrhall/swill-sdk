const httpClient = require('../core/http-client');
const socketClient = require('../core/socket-client');
const onUpdateFns = [];
const socketEvents = [
  'ADDON_DOWNLOAD_STARTED',
  'ADDON_DOWNLOADED'
];

// Return an array of plugins
async function getPlugins(){
  const pluginList = await httpClient.get('/editor/list');
  return Object.keys(pluginList).map(name => ({
    name,
    ...(pluginList[name])
  }));
}

// Download and install a plugin
async function installPlugin(pluginName){
  await httpClient.post(`/editor/${pluginName}/download`);

  return { name: pluginName };
}

// Allow clients to register listeners for when the config object updates.
const onUpdate = fn => onUpdateFns.push(fn);

// For any of the registered socket events, register listeners and make sure
// to update any consumers of changes to the data models in the socket updates.
socketEvents.forEach(event => socketClient.on(
  event,
  data => onUpdateFns.forEach(fn => fn(event, data))
));

module.exports = {
  getPlugins,
  installPlugin,
  onUpdate
};