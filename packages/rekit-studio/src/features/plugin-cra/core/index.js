const app = require('./app');
const component = require('./component');
const action = require('./action');
const hooks = require('./hooks');

module.exports = {
  app,
  hooks,
  elements: {
    component,
    action,
  },
};
