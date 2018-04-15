/* global reRequire, mockSocketIO, mockHttpFetch, sandbox, expect */

describe('Resource Interface', () => {
  let resourceInterface;

  beforeEach(() => {
    mockSocketIO();
    mockHttpFetch();
    resourceInterface = reRequire('../../src/core/resource-interface');
  });

  it('can generate a basic resource', () => {
    const cats = resourceInterface('cats');
    expect(cats).to.be.an('object');
  });

  it('generates the right methods', () => {
    const cats = resourceInterface('cats');
    expect(cats.getCats).to.be.a('function');
    expect(cats.getCatTypes).to.be.a('function');
    expect(cats.onUpdate).to.be.a('function');
    expect(Object.keys(cats).length).to.equal(3);
  });

  describe('Socket Updates', () => {
    let socketClient,
      socketOn,
      cats;

    beforeEach(() => {
      socketClient = require('../../src/core/socket-client');
      socketOn = sandbox.stub(socketClient, 'on');
      cats = resourceInterface('cats', ['CAT_UPDATE']);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('registers socket listeners for the events passed in', () => {
      expect(socketOn.callCount).to.equal(1);
      expect(socketOn.args[0][0]).to.equal('CAT_UPDATE');
    });

    it('passes through any socket events to clients that register listeners on the resource', done => {
      cats.onUpdate(() => done());
      socketOn.args[0][1]();
    });
  });

  describe('Getting Resource List', () => {
    let cats;
    beforeEach(() => cats = resourceInterface('cats', ['CAT_UDPATE']));

    it('returns an array of resources', async () => {
      expect(await cats.getCats()).to.be.an('array');
    });

    it('binds each resource with setState', async () => {
      expect((await cats.getCats())[0].setState).to.be.a('function');
    });

    it('handles the steps resource as a special case', async () => {
      const steps = resourceInterface('steps');
      expect(await steps.getSteps()).to.be.an('array');
    });
  });

  describe('Getting Resource Types', () => {
    it('returns an array of types', async () => {
      const cats = resourceInterface('cats');
      expect(await cats.getCatTypes()).to.be.an('array');
    });

    it('handles the kettles index as a special case', async () => {
      const kettles = resourceInterface('kettles', [], false);
      expect(await kettles.getKettleTypes()).to.be.an('array');
    });

    it('handles the kettles index as a special case', async () => {
      const fermenters = resourceInterface('fermenters', [], false);
      expect(await fermenters.getFermenterTypes()).to.be.an('array');
    });
  });

  describe('Setting State on a Resource', () => {
    let cats,
      cat;

    beforeEach(async () => {
      const httpClient = require('../../src/core/http-client');
      sandbox.stub(httpClient, 'put').resolves({name: 'NewCatName'});
      cats = resourceInterface('cats');
      cat = (await cats.getCats())[0];
    });

    afterEach(() => sandbox.restore());

    it('edits a property on an object', async () => {
      const newCat = await cat.setState({name:'NewCatName'});
      expect(newCat.name).to.equal('NewCatName');
    });

    it('updates all listeners of a change', done => {
      cats.onUpdate((eventName, newCat) => {
        expect(eventName).to.equal('UPDATE_CAT');
        expect(newCat.name).to.equal('NewCatName');
        done();
      });

      cat.setState({name:'NewCatName'});
    });
  });
});
