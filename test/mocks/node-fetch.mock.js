module.exports = global.sandbox.stub().resolves({
  json: global.sandbox.stub().resolves({
    foo: 'bar'
  })
});
