const studio = require('./studio');
const file = require('./file');
const folder = require('./folder');

module.exports = {
  name: 'default',
  studio,
  elements: {
    file,
    folder,
  },
};
