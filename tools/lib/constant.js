'use strict';

const _ = require('lodash');
const utils = require('./utils');
const vio = require('./vio');

module.exports = {
  add(feature, name) {
    name = _.upperSnakeCase(name);
    const targetPath = utils.getReduxFile(feature, 'constants');
    const lines = vio.getLines(targetPath);
    if (lines.length && !lines[lines.length - 1]) lines.pop();
    lines.push(`export const ${name} = '${name}';`);
    lines.push('');

    vio.save(targetPath, lines);
  },

  remove(feature, name) {
    name = _.upperSnakeCase(name);
    const targetPath = utils.getReduxFile(feature, 'constants');
    const lines = vio.getLines(targetPath);
    utils.removeLines(lines, `export const ${name} = '${name}';`);

    vio.save(targetPath, lines);
  },

  rename(feature, oldName, newName) {
    oldName = _.upperSnakeCase(oldName);
    newName = _.upperSnakeCase(newName);

    const targetPath = utils.getReduxFile(feature, 'constants');
    const lines = vio.getLines(targetPath);
    const i = utils.lineIndex(lines, `export const ${oldName} = '${oldName}';`);
    if (i >= 0) {
      lines[i] = `export const ${newName} = '${newName}';`;
    }

    vio.save(targetPath, lines);
  },
};
