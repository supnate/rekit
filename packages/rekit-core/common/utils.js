const path = require('path');

module.exports = {
  relativePath(from, to) {
    return path.relative(from, to).replace(/\\/g, '/');
  },
};
