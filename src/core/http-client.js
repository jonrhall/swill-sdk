'use strict';

const fetch = require('node-fetch');

const HTTP_INTERVAL = global.SWILL_SDK_CONFIG.cacheInterval;
const HTTP_ADDRESS = `${global.SWILL_SDK_CONFIG.server}:${global.SWILL_SDK_CONFIG.port}`;

const options = {
  mode: 'cors',
  headers: { 'Access-Control-Allow-Origin': '*' }
};

// Initialize an empty cache
let cache = {};

// Make an API request to CraftBeerPi
async function makeRequest(route, method, options){
  let cachedResponse,
    response;

  // POST and PUT methods invalidate the cache because they could mutate server data
  // that causes race conditions like how getSystemDump() would return stale data before
  // the current HTTP_INTERVAL expires.
  if(method === 'POST' || method === 'PUT'){
    cache = {};
  }

  // For now, only retrieve GET responses from the cache
  if(method === 'GET'){
    cachedResponse = getCachedResponse(route, method);
  }

  // If there's a valid cached response, return it rather than fetching a new response
  if(cachedResponse){
    return cachedResponse;
  }

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

  // Cache the response
  setCachedResponse(response, route, method);

  return response;
}

// Attempt to get a cached response
function getCachedResponse(route, method){
  let key = `${route}//${method}`;

  // If there is a cache hit and it's within the tolerated interval for returning cached responses,
  // serve that response, otherwise return null.
  return (cache[key] && (Date.now() - cache[key].timestamp) < HTTP_INTERVAL) ?
    cache[key].response :
    null;
}

// Set a cached response
function setCachedResponse(response, route, method){
  cache[`${route}//${method}`] = CachedResponse({ response, route });
}

// The cached response object
function CachedResponse(data){
  return {
    response: data.response || {},
    timestamp: Date.now(),
    route: data.route,
    method: data.method || 'GET'
  };
}

// Expose basic HTTP CRUD operations, and a special system dump command.
module.exports = {
  get: async route => 
    await makeRequest(`${HTTP_ADDRESS}/api${route}`, 'GET', options),
  getSystemDump: async () => 
    await makeRequest(`${HTTP_ADDRESS}/api/system/dump`, 'GET', options),
  post: async (route, data) => 
    await makeRequest(`${HTTP_ADDRESS}/api${route}`, 'POST', Object.assign({}, options, {
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })),
  put: async (route, data) => 
    await makeRequest(`${HTTP_ADDRESS}/api${route}`, 'PUT', Object.assign({
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })),
  delete: async route => 
    await makeRequest(`${HTTP_ADDRESS}/api${route}`, 'DELETE', options)
};
