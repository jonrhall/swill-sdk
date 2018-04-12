/* global reRequire, mock, expect */

describe('HTTP Client', () => {
  let fetchMock, httpClient;

  beforeEach(() => {
    fetchMock = reRequire('../mocks/node-fetch.mock');
    mock('node-fetch', fetchMock);
    httpClient = reRequire('../../src/core/http-client');
  });

  afterEach(() => {
    global.mock.stop('node-fetch');
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
