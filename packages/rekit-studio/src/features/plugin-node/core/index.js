

module.exports = {
  name: 'node',
  app: require('./app'),
  deps: require('./deps'),
  elements: {
    page: require('./page'),
    'ui-module': require('./uiModule'),
    service: require('./service'),
    layout: require('./layout'),
  },
};