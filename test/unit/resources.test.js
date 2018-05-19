/* global reRequire, mockSocketIO, expect */

describe('Resources', () => {
  const resources = [ 'actors', 'kettles', 'fermenters', 'sensors', 'steps' ];
  let resourcesModule;

  beforeEach(() => {
    mockSocketIO();
    resourcesModule = reRequire('../../src/core/resources');
  });

  resources.forEach(resource => {
    it(`exports the ${resource} object`, () => {
      expect(resourcesModule[resource]).to.be.an('object');
    });
  });

  it('doesn\'t leak any other objects', () => {
    expect(Object.keys(resourcesModule).length).to.equal(resources.length);
  });
});
