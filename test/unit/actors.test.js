describe('Actors Resource', () => {
  const socketClientMock = require('../mocks/socket-client.mock');

  global.mockRequire('../../src/core/socket-client', socketClientMock);

  const actorsResources = require('../../src/resources/actors');

  after(() => {
    global.mockRequire.stop('../../src/core/socket-client');
  });

  it('registers socket handlers', () => {
    expect(socketClientMock.on.callCount).to.equal(1);
  });
});
