describe('Socket Client', () => {
  const ioMock = require('../mocks/socket.io-client.mock');
  let socketClient;

  beforeEach(() => {
    socketClient = require('../../src/core/socket-client');
  });

  it('returns a function to register listeners', () => {
    expect(socketClient.on).to.be.a('function');
  });

  it('instantiates socket.io-client', () => {
    expect(ioMock.callCount).to.equal(1);
  });
});
