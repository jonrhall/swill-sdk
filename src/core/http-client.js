'use strict';

const fetch = require('node-fetch'),
  HTTP_INTERVAL = global.SDK_CONFIG.httpInterval || 5000,
  HTTP_ADDRESS = global.SDK_CONFIG.httpAddress || 'http://localhost:5000',
  options = {
    mode: 'cors',
    headers: { 'Access-Control-Allow-Origin': '*' }
  };

// Initialize an empty cache
let cache = {};

module.exports = {
  // Prepend the CraftBeerPi server route to the specified API route
  get: async route => await makeRequest(`${HTTP_ADDRESS}/api${route}`, 'GET', options)
};

// Make an API request to CraftBeerPi
async function makeRequest(route, method, options){
  let cachedResponse,
    response;

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
    route: data.route || '',
    method: data.method || 'GET'
  };
}
