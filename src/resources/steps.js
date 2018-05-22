'use strict';

const stepInterface = require('../core/resource-interface')({
    name: 'steps',
    socketEvents: ['UPDATE_ALL_STEPS'],
    template: {
      name: 'NewMashStep',
      type: ''
    }
  }),
  httpClient = require('../core/http-client');

// Clear all steps from CraftBeerPi
stepInterface.clearSteps = async () => {
  return await httpClient.delete(`/step/`);
};

// Run the next step
stepInterface.nextStep = async () => {
  return await httpClient.post(`/step/next`);
};

// Start the current step's timer
stepInterface.startStep = async () => {
  return await httpClient.post(`/step/action/start`);
};

// Start the step order
stepInterface.startSteps = async () => {
  return await httpClient.post(`/step/start`);
};

// Reorder the steps, based on an ordered array of steps given.
stepInterface.reorderSteps = async steps => {
  return await httpClient.post('/step/sort', steps.map((step,index) => [step.id, index]));
};

// Reset the currently running step
stepInterface.resetStep = async () => {
  return await httpClient.post(`/step/reset/current`);
};

// Stop and reset the step order
stepInterface.resetSteps = async () => {
  return await httpClient.post(`/step/reset`);
};

// Stop and reset the step order, then start the steps again. Basically a macro
// for resetSteps and startSteps called together.
stepInterface.restartSteps = async () => {
  await stepInterface.resetSteps();
  await stepInterface.startSteps();
};

module.exports = stepInterface;
