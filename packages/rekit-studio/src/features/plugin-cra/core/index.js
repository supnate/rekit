const component = require('./component');
const action = require('./action');

module.exports = {
  app: require('./app'),
  elements: {
    component,
    action,
  },
  hooks: {
    beforeAddComponent() {
      console.log('before add component');
    }
  },
};
