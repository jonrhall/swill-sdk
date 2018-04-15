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

  describe('On Incoming Event', () => {
    let socketOn;

    beforeEach(() => {
      socketOn = socketIoClientMock().on;
    });

    it('listens for all possible events', () => {
      expect(socketOn.callCount).to.equal(13);
    });

    it('registers a function to handle every event', () => {
      expect(socketOn.args[0][1]).to.not.throwError();
    });

    it('dispatches any events it hears to its own set of listeners', done => {
      socketClient.on('SENSOR_UPDATE', () => done());
      socketOn.args[3][1]();
    });

    it('can register multiple listeners for the same event', done => {
      let count = 0;
      socketClient.on('SENSOR_UPDATE', () => ++count === 2 ? done() : null);
      socketClient.on('SENSOR_UPDATE', () => ++count === 2 ? done() : null);
      socketOn.args[3][1]();
    });
  });
});
