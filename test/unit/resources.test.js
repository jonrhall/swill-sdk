/* global reRequire, mockSocketIO, expect */

describe('Resources', () => {
  let resourcesModule;

  beforeEach(() => {
    mockSocketIO();
    resourcesModule = reRequire('../../src/core/resources');
  });

  [ 'actors', 'kettles', 'fermenters', 'sensors', 'steps' ].forEach(resource => {
    it(`exports the ${resource} object`, () => {
      expect(resourcesModule[resource]).to.be.an('object');
    });
  });

  it('doesn\'t leak any other objects', () => {
    expect(Object.keys(resourcesModule).length).to.equal(5);
  });
});
