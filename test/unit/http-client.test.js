describe('HTTP Client', () => {
  const fetchMock = require('../mocks/node-fetch.mock');
  let httpClient;

  beforeEach(() => {
    httpClient = require('../../src/core/http-client');
  });

  afterEach(() => {
    global.sandbox.restore();
  });

  describe('GET requests', async () => {
    it('can execute a basic request', async () => {
      let data = await httpClient.get('/system/dump');
      expect(data).to.be.an('object');
    });

    it('calls fetch when executing a request', async () => {
      await httpClient.get('/system/dump');
      expect(fetchMock.callCount).to.equal(1);
    });
  });
});
