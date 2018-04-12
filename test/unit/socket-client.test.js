/* global reRequire, mockSocketIO, expect */

describe('Socket Client', () => {
  let socketIoClientMock, socketClient;

  beforeEach(() => {
    socketIoClientMock = mockSocketIO();
    socketClient = reRequire('../../src/core/socket-client');
  });

  it('returns a function to register listeners', () => {
    expect(socketClient.on).to.be.a('function');
  });

  it('opens a socket.io-client connection', () => {
    expect(socketIoClientMock.callCount).to.equal(1);
  });
});
