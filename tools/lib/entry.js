'use strict';

// Summary

const _ = require('lodash');
const inout = require('./inout');
const helpers = require('./helpers');

module.exports = {
  add(feature, name) {
    name = _.pascalCase(name);
    const targetPath = helpers.mapFile(feature, 'index.js');
    const lines = inout.getLines(targetPath);
    const i = helpers.lastLineIndex(lines, /^export .* from /);
    lines.splice(i + 1, 0, `export ${name} from './${name}';`);
    inout.save(targetPath, lines);
  },

  remove(feature, name) {
    name = _.pascalCase(name);
    const targetPath = helpers.mapFile(feature, 'index.js');
    const lines = inout.getLines(targetPath);
    helpers.removeLines(lines, `export ${name} from './${name}';`);
    inout.save(targetPath, lines);
  },

  addToActions(feature, name, actionFile) {
    name = _.camelCase(name);
    actionFile = _.camelCase(actionFile || name);
    const targetPath = helpers.getReduxFile(feature, 'actions');
    const lines = inout.getLines(targetPath);
    let i = helpers.lineIndex(lines, ` from './${actionFile}'`);
    if (i >= 0) {
      // if action already exists
      const line = lines[i];
      const m = /^export \{([^}]+)\}/.exec(line);
      const arr = m[1].split(',').map(s => s.trim());
      if (!_.includes(arr, name)) {
        arr.push(name);
        lines[i] = line.replace(/\{[^}]+\}/, `{ ${arr.join(', ')} }`);
      }
    } else {
      i = helpers.lastLineIndex(lines, /^export .* from /);
      lines.splice(i + 1, 0, `export { ${name} } from './${actionFile}';`);
    }

    inout.save(targetPath, lines);
  },

  removeFromActions(feature, name, actionFile) {
    name = _.camelCase(name);
    actionFile = _.camelCase(actionFile || name);
    const targetPath = helpers.getReduxFile(feature, 'actions');
    const lines = inout.getLines(targetPath);
    const i = helpers.lineIndex(lines, ` from './${actionFile}'`);
    if (i >= 0) {
      const line = lines[i];
      const m = /^export \{([^}]+)\}/.exec(line);
      const arr = m[1].split(',').map(s => s.trim());
      _.pull(arr, name);

      if (arr.length > 0) {
        lines[i] = line.replace(/\{[^}]+\}/, `{ ${arr.join(', ')} }`);
      } else {
        lines.splice(i, 1);
      }
    }

    inout.save(targetPath, lines);
  },

  addToReducer(feature, name) {
    
  },

  removeFromReducer(feature, name) {
    
  },
};
