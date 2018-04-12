const path = require('path');
global.mockRequire = require('mock-require');

// Mock an empty SDK config object
global.SDK_CONFIG = {};

// Define the location of all sources
global.appSrc = path.resolve(`${__dirname}/../src`);

// Define the location of all the mocks
global.mockRoot = path.resolve(`${__dirname}/mocks`);

// Pre-load expectation library, every test will need it
global.expect = require('expect.js');

// Pre-create the test sandbox
global.sandbox = require('sinon').sandbox.create();

// Register global mocks that never change
global.mockRequire('node-fetch', './mocks/node-fetch.mock');
global.mockRequire('socket.io-client', './mocks/socket.io-client.mock');

