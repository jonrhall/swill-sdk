/* global reRequire, mockSocketIO, sandbox, expect */

describe('Actors Resource', () => {
  let actorsResource, socketClientOn;

  beforeEach(() => {
    mockSocketIO();
    sandbox.stub(reRequire('../../src/core/http-client'), 'get').resolves({actors:{foo: 'bar'}});
    socketClientOn = sandbox.spy(reRequire('../../src/core/socket-client'), 'on');
    actorsResource = reRequire('../../src/resources/actors');
  });

  afterEach(() => sandbox.restore());

  it('registers socket handlers', () => {
    expect(socketClientOn.callCount).to.equal(1);
  });

  it('can get the current actors', async () => {
    expect(await actorsResource.getActors()).to.eql({foo:'bar'});
  });
});
