'use strict';

const fetch = require('node-fetch');

const HTTP_ADDRESS = `${global.SWILL_SDK_CONFIG.server}:${global.SWILL_SDK_CONFIG.port}`;

const options = {
  mode: 'cors',
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
};

// Make an API request to CraftBeerPi
async function makeRequest(route, method, options){
  let response;

  // Make the actual request to the server, get back a stream of data,
  // turn the stream into JSON. There's a lot of assumptions in this statement
  // that need to hold true for any given response, but because it's so assertive
  // the try-catch is a good buffer to catch complex errors.
  try {
    response = await (await fetch(route, Object.assign({ method }, options))).json();
  } catch(err){
    // If the response doesn't contain any JSON, it's because CBPi frequently uses HTTP 204 status
    // codes (Empty Response) in its POST responses. In those cases the .json() call will fail.
    // That's fine, since there is no response to parse anyways and the response can stay null.
    if(method !== 'POST' && err.toString() !== 'SyntaxError: Unexpected end of JSON input')
      throw new Error(`Error retrieving ${route}: ${err}`);
  }

  return response;
}

// Expose basic HTTP CRUD operations, and a special system dump command.
module.exports = {
  get: async route => 
    makeRequest(`${HTTP_ADDRESS}/api${route}`, 'GET', options),
  getSystemDump: async () => 
    makeRequest(`${HTTP_ADDRESS}/api/system/dump`, 'GET', options),
  post: async (route, data) => 
    makeRequest(`${HTTP_ADDRESS}/api${route}`, 'POST', Object.assign({}, options, {
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })),
  put: async (route, data) => 
    makeRequest(`${HTTP_ADDRESS}/api${route}`, 'PUT', Object.assign({
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })),
  delete: async route =>
    makeRequest(`${HTTP_ADDRESS}/api${route}`, 'DELETE', options),
  head: async route =>
    fetch(`${HTTP_ADDRESS}/api${route}`, Object.assign({ method: 'HEAD' }, options))
};
