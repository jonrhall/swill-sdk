describe('Resources', () => {
  const actorsMock = require('../mocks/actors.mock');

  global.mockRequire('../../src/resources/actors', actorsMock);

  const resourcesModule = require('../../src/core/resources');

  after(() => {
    global.mockRequire.stop('../../src/resources/actors');
  });

  it('exports an actors object', () => {
    expect(resourcesModule.actors).to.be.an('object');
  });
});
