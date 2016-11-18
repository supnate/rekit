'use strict';

const _ = require('lodash');
const helpers = require('./helpers');
const vio = require('./vio');

module.exports = {
  add(feature, name) {
    name = _.upperSnakeCase(name);
    const targetPath = helpers.getReduxFile(feature, 'constants');
    const lines = vio.getLines(targetPath);
    if (lines.length && !lines[lines.length - 1]) lines.pop();
    lines.push(`export const ${name} = '${name}';`);
    lines.push('');

    vio.save(targetPath, lines);
  },

  remove(feature, name) {
    name = _.upperSnakeCase(name);
    const targetPath = helpers.getReduxFile(feature, 'constants');
    const lines = vio.getLines(targetPath);
    helpers.removeLines(lines, `export const ${name} = '${name}';`);

    vio.save(targetPath, lines);
  },
};
