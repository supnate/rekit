const middleware = require('./middleware');

const plugin = {
  name: 'terminal',
  middleware,
};

module.exports = plugin;
