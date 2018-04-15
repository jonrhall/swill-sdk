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

  describe('GET requests', () => {
    it('can execute a basic request', async () => {
      let data = await httpClient.get('/system/dump');
      expect(data).to.be.an('object');
    });

    it('calls fetch when executing a request', async () => {
      await httpClient.get('/system/dump');
      expect(fetchMock.callCount).to.equal(1);
    });

    it('will serve a cached request if it is within an acceptable timeframe', async () => {
      await httpClient.get('/system/dump');
      await httpClient.get('/system/dump');
      expect(fetchMock.callCount).to.equal(1);
    });

    it('throws errors when there is a problem fetching data', done => {
      fetchMock.throws();
      httpClient.get('/system/dump').catch(() => done());
    });
  });

  describe('POST requests', () => {
    it('can execute a basic request', async () => {
      let data = await httpClient.post('/actors/1');
      expect(data).to.be.an('object');
    });

    it('swallows any errors that have to do with parsing 204 No Content responses', async () => {
      fetchMock.throws(new SyntaxError('Unexpected end of JSON input'));
      await httpClient.post('/actors/1');
    });
  });

  describe('PUT requests', () => {
    it('can execute a basic request', async () => {
      let data = await httpClient.put('/actors/1', {foo: 'bar'});
      expect(data).to.be.an('object');
    });

    it('attaches the right headers', async () => {
      await httpClient.put('/actors/1', {foo: 'bar'});
      expect(fetchMock.args[0][1].headers.Accept).to.equal('application/json, text/plain, */*');
      expect(fetchMock.args[0][1].headers['Content-Type']).to.equal('application/json;charset=UTF-8');
    });
  });
});
