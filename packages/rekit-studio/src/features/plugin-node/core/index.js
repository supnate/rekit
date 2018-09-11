

module.exports = {
  name: 'node',
  app: require('./app'),
  elements: {
    page: require('./page'),
    'ui-module': require('./uiModule'),
    service: require('./service'),
    layout: require('./layout'),
  },
};