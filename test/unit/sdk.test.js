/* global reRequire, mockSocketIO, expect */

describe('Swill SDK', () => {
  let sdkClient;

  beforeEach(() => {
    mockSocketIO();
    sdkClient = reRequire('../../src/sdk');
  });

  it('returns a function to generate a SDK', () => expect(sdkClient).to.be.a('function'));

  describe('Generating an SDK', () => {
    let sdk;

    beforeEach(() => sdk = sdkClient());

    it('returns a socket client', () => {
      expect(sdk.socketClient).to.be.an('object');
    });

    it('returns a http client', () => {
      expect(sdk.httpClient).to.be.an('object');
    });

    it('returns a resources object', () => {
      expect(sdk.resources).to.be.an('object');
    });
  });
});
