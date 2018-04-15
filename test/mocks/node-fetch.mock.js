module.exports = global.sandbox.stub().resolves({
  json: global.sandbox.stub().resolves({
    cats: {1: {id: 1, name: 'cat1'}},
    cat_types: {1: {id: 9, type: 'Siamese'}},
    steps: [{id: 1, name: 'step1'}],
    kettle: {1: {id: 1, name: 'kettle1'}},
    controller_types: {1: {id: 23, name: 'KettleType123'}},
    fermentation_controller_types: {1: {id: 23, name: 'KettleType123'}}
  })
});
