'use strict';

// Summary
//  Modify entry files to add/remove entries for page, component, action, etc...

const path = require('path');
const _ = require('lodash');
const vio = require('./vio');
const helpers = require('./helpers');

module.exports = {
  addToIndex(feature, name) {
    name = _.pascalCase(name);
    const targetPath = helpers.mapFile(feature, 'index.js');
    const lines = vio.getLines(targetPath);
    const i = helpers.lastLineIndex(lines, /^export .* from /);
    lines.splice(i + 1, 0, `export ${name} from './${name}';`);
    vio.save(targetPath, lines);
  },

  removeFromIndex(feature, name) {
    name = _.pascalCase(name);
    const targetPath = helpers.mapFile(feature, 'index.js');
    const lines = vio.getLines(targetPath);
    helpers.removeLines(lines, `export ${name} from './${name}';`);
    vio.save(targetPath, lines);
  },

  addToStyle(feature, name) {
    const targetPath = helpers.mapFile(feature, 'style.less');
    const lines = vio.getLines(targetPath);
    const i = helpers.lastLineIndex(lines, '@import ');
    lines.splice(i + 1, 0, `@import './${_.pascalCase(name)}.less';`);
    vio.save(targetPath, lines);
  },

  removeFromStyle(feature, name) {
    const targetPath = helpers.mapFile(feature, 'style.less');
    const lines = vio.getLines(targetPath);
    const i = helpers.lastLineIndex(lines, '@import ');
    lines.splice(i + 1, 0, `@import './${_.pascalCase(name)}.less';`);
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

  addToRootReducer(feature) {
    const targetPath = path.join(helpers.getProjectRoot(), 'src/common/rootReducer.js');
    const lines = vio.getLines(targetPath);
    helpers.addImportLine(lines, `import ${_.camelCase(feature)}Reducer from '../features/${_.kebabCase(feature)}/redux/reducer';`);
    const i = helpers.lastLineIndex(lines, /^\}\);$/, helpers.lineIndex(lines, 'const rootReducer = combineReducers({'));
    lines.splice(i, 0, `  ${_.camelCase(feature)}: ${_.camelCase(feature)}Reducer,`);

    vio.save(targetPath, lines);
  },

  removeFromRootReducer(feature) {
    // NOTE: currently only used by feature
    const targetPath = path.join(helpers.getProjectRoot(), 'src/common/rootReducer.js');
    const lines = vio.getLines(targetPath);
    helpers.removeLines(lines, `'../features/${_.kebabCase(feature)}/redux/reducer';`);
    helpers.removeLines(lines, `: ${_.camelCase(feature)}Reducer,`);

    vio.save(targetPath, lines);
  },

  addToRouteConfig(feature) {
    const targetPath = path.join(helpers.getProjectRoot(), 'src/common/routeConfig.js');
    const lines = vio.getLines(targetPath);
    helpers.addImportLine(lines, `import ${_.camelCase(feature)}Route from '../features/${_.kebabCase(feature)}/route';`);
    let i = helpers.lineIndex(lines, 'path: \'*\'');
    // istanbul ignore if
    if (i === -1) {
      i = helpers.lastLineIndex(lines, /^ {2}]/);
    }
    lines.splice(i, 0, `    ${_.camelCase(feature)}Route,`);

    vio.save(targetPath, lines);
  },

  removeFromRouteConfig(feature) {
    const targetPath = path.join(helpers.getProjectRoot(), 'src/common/routeConfig.js');
    const lines = vio.getLines(targetPath);
    helpers.removeLines(lines, `import ${_.camelCase(feature)}Route from '../features/${_.kebabCase(feature)}/route';`);
    helpers.removeLines(lines, `    ${_.camelCase(feature)}Route,`);

    vio.save(targetPath, lines);
  },

  addToRootStyle(feature) {
    const targetPath = path.join(helpers.getProjectRoot(), 'src/styles/index.less');
    const lines = vio.getLines(targetPath);
    helpers.addImportLine(lines, `@import '../features/${_.kebabCase(feature)}/style.less';`);

    vio.save(targetPath, lines);
  },

  removeFromRootStyle(feature) {
    const targetPath = path.join(helpers.getProjectRoot(), 'src/styles/index.less');
    const lines = vio.getLines(targetPath);
    helpers.removeLines(lines, `features/${_.kebabCase(feature)}/style.less';`);

    vio.save(targetPath, lines);
  },
};
