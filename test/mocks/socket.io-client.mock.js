
const onevent = global.sandbox.stub(),
  on = global.sandbox.stub(),
  // IMPORTANT: do not construct a singleton socket object and try to return it from 'io'. The object
  // returned has to be a different reference, but the functions can remain immutable.
  io = global.sandbox.stub().returns({ on, onevent });

module.exports = io;
