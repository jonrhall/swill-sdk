// Alias the mock and require commands so that they are available to all tests
global.mock = require('mock-require');
global.reRequire = global.mock.reRequire;

// Mock an empty SDK config object
global.SWILL_SDK_CONFIG = {};

// Pre-load expectation library, every test will need it
global.expect = require('expect.js');

// Pre-create the test sandbox
global.sandbox = require('sinon').sandbox.create();

global.mockSocketIO = function mockSocketIO(){
  global.mock.stop('socket.io-client');
  const socketIoClientMock = global.mock.reRequire('./mocks/socket.io-client.mock');
  global.mock('socket.io-client', socketIoClientMock);
  return socketIoClientMock;
};

global.mockHttpFetch = function mockHttpFetch(){
  global.mock.stop('node-fetch');
  const fetchMock = global.mock.reRequire('./mocks/node-fetch.mock');
  global.mock('node-fetch', fetchMock);
  return fetchMock;
};
