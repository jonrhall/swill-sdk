const httpClient = require('../core/http-client');

const onUpdateFns = [];

// Return an array of plugins
async function getPlugins(){
  const pluginList = await httpClient.get('/editor/list');
  return Object.keys(pluginList).map(name => Object.assign({}, pluginList[name], { name }));
}

// Download and install a plugin
async function installPlugin(name){
  await httpClient.post(`/editor/${name}/download`);

  // CraftBeerPi can be inconsistent in when it updates its resources via websocket and when it
  // updates its resources only via HTTP response. This function makes it so that a user can rely
  // on the 'onUpdate' function to truly give them all the resource object updates they need.
  onUpdateFns.forEach(fn => fn('INSTALL_PLUGIN', { name }));

  return { name };
}

// Download and install a plugin
async function updatePlugin(name){
  await httpClient.post(`/editor/${name}/update`);

  // CraftBeerPi can be inconsistent in when it updates its resources via websocket and when it
  // updates its resources only via HTTP response. This function makes it so that a user can rely
  // on the 'onUpdate' function to truly give them all the resource object updates they need.
  onUpdateFns.forEach(fn => fn('UPDATE_PLUGIN', { name }));

  return { name };
}

// Download and install a plugin
async function deletePlugin(name){
  await httpClient.delete(`/editor/${name}`);

  // CraftBeerPi can be inconsistent in when it updates its resources via websocket and when it
  // updates its resources only via HTTP response. This function makes it so that a user can rely
  // on the 'onUpdate' function to truly give them all the resource object updates they need.
  onUpdateFns.forEach(fn => fn('DELETE_PLUGIN', { name }));

  return { name };
}

// Allow clients to register listeners for when the config object updates.
const onUpdate = fn => onUpdateFns.push(fn);

module.exports = {
  getPlugins,
  installPlugin,
  updatePlugin,
  deletePlugin,
  onUpdate
};