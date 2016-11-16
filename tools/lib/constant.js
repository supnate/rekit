'use strict';

const _ = require('lodash');
const helpers = require('./helpers');
const inout = require('./inout');

module.exports = {
  add(feature, name) {
    name = _.upperSnakeCase(name);
    const targetPath = helpers.getReduxFile(feature, 'constants');
    const lines = inout.getLines(targetPath);
    if (lines.length && !lines[lines.length - 1]) lines.pop();
    lines.push(`export const ${name} = '${name}';`);
    lines.push('');

    inout.save(targetPath, lines);
  },

  remove(feature, name) {
    name = _.upperSnakeCase(name);
    const targetPath = helpers.getReduxFile(feature, 'constants');
    const lines = inout.getLines(targetPath);
    helpers.removeLines(lines, `export const ${name} = '${name}';`);

    inout.save(targetPath, lines);
  },
};
