'use strict';

// Summary
//  Modify entry files to add/remove entries for page, component, action, etc...

const _ = require('lodash');
const vio = require('./vio');
const helpers = require('./helpers');

module.exports = {
  add(feature, name) {
    name = _.pascalCase(name);
    const targetPath = helpers.mapFile(feature, 'index.js');
    const lines = vio.getLines(targetPath);
    const i = helpers.lastLineIndex(lines, /^export .* from /);
    lines.splice(i + 1, 0, `export ${name} from './${name}';`);
    vio.save(targetPath, lines);
  },

  remove(feature, name) {
    name = _.pascalCase(name);
    const targetPath = helpers.mapFile(feature, 'index.js');
    const lines = vio.getLines(targetPath);
    helpers.removeLines(lines, `export ${name} from './${name}';`);
    vio.save(targetPath, lines);
  },

  addToActions(feature, name, actionFile) {
    name = _.camelCase(name);
    actionFile = _.camelCase(actionFile || name);
    const targetPath = helpers.getReduxFile(feature, 'actions');
    const lines = vio.getLines(targetPath);
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

    vio.save(targetPath, lines);
  },

  removeFromActions(feature, name, actionFile) {
    name = _.camelCase(name);
    actionFile = _.camelCase(actionFile || name);
    const targetPath = helpers.getReduxFile(feature, 'actions');
    const lines = vio.getLines(targetPath);
    if (!name) {
      // Remove all imports from the action
      helpers.removeLines(lines, `from './${actionFile}`);
    } else {
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
    }

    vio.save(targetPath, lines);
  },

  addToReducer(feature, action) {
    const targetPath = helpers.getReduxFile(feature, 'reducer');
    const lines = vio.getLines(targetPath);
    const camelActionName = _.camelCase(action);
    helpers.addImportLine(lines, `import { reducer as ${camelActionName} } from './${camelActionName}';`);
    const i = helpers.lineIndex(lines, /^];/, helpers.lineIndex(lines, 'const reducers = ['));
    lines.splice(i, 0, `  ${camelActionName},`);

    vio.save(targetPath, lines);
  },

  removeFromReducer(feature, action) {
    const targetPath = helpers.getReduxFile(feature, 'reducer');
    const lines = vio.getLines(targetPath);
    const camelActionName = _.camelCase(action);
    helpers.removeLines(lines, `from './${camelActionName}'`);
    helpers.removeLines(lines, `  ${camelActionName},`, helpers.lineIndex(lines, 'const reducers = ['));

    vio.save(targetPath, lines);
  },

  addToInitialState(feature, name, value) {
    const targetPath = helpers.getReduxFile(feature, 'initialState');
    const lines = vio.getLines(targetPath);
    const i = helpers.lastLineIndex(lines, /^\};/);
    lines.splice(i, 0, `  ${name}: ${value},`);

    vio.save(targetPath, lines);
  },

  removeFromInitialState(feature, name) {
    // TODO: currently only supports to remove one line state.
    const targetPath = helpers.getReduxFile(feature, 'initialState');
    const lines = vio.getLines(targetPath);
    helpers.removeLines(lines, `  ${name}: `);
    vio.save(targetPath, lines);
  },
};
