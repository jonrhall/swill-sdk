/* global reRequire, mockSocketIO, expect */

describe('Resources', () => {
  let resourcesModule;

  beforeEach(() => {
    mockSocketIO();
    resourcesModule = reRequire('../../src/core/resources');
  });

  it('exports an actors object', () => {
    expect(resourcesModule.actors).to.be.an('object');
  });
});
