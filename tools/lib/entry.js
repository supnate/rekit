'use strict';

// Summary
//  Modify entry files to add/remove entries for page, component, action, etc...

const path = require('path');
const _ = require('lodash');
const vio = require('./vio');
const refactor = require('./refactor');
const utils = require('./utils');

module.exports = {
  addToIndex(feature, name) {
    name = _.pascalCase(name);
    const targetPath = utils.mapFile(feature, 'index.js');
    const lines = vio.getLines(targetPath);
    const i = utils.lastLineIndex(lines, /^export .* from /);
    lines.splice(i + 1, 0, `export ${name} from './${name}';`);
    vio.save(targetPath, lines);
  },

  removeFromIndex(feature, name) {
    name = _.pascalCase(name);
    const targetPath = utils.mapFile(feature, 'index.js');
    const lines = vio.getLines(targetPath);
    utils.removeLines(lines, `export ${name} from './${name}';`);
    vio.save(targetPath, lines);
  },

  renameInIndex(feature, oldName, newName) {
    // Rename export xxx from './xxx'
    oldName = _.pascalCase(oldName);
    newName = _.pascalCase(newName);
    const targetPath = utils.mapFile(feature, 'index.js');
    const lines = vio.getLines(targetPath);
    const i = utils.lineIndex(lines, new RegExp(`export +${oldName} +from '\\.\\/${oldName}'`));
    if (i >= 0) {
      lines[i] = `export ${newName} from './${newName}';`;
    }

    vio.save(targetPath, lines);
  },

  addToStyle(feature, name) {
    const targetPath = utils.mapFile(feature, 'style.less');
    const lines = vio.getLines(targetPath);
    const i = utils.lastLineIndex(lines, '@import ');
    lines.splice(i + 1, 0, `@import './${_.pascalCase(name)}.less';`);
    vio.save(targetPath, lines);
  },

  removeFromStyle(feature, name) {
    const targetPath = utils.mapFile(feature, 'style.less');
    const lines = vio.getLines(targetPath);
    utils.removeLines(lines, `@import './${_.pascalCase(name)}.less';`);
    vio.save(targetPath, lines);
  },

  renameInStyle(feature, oldName, newName) {
    const targetPath = utils.mapFile(feature, 'style.less');
    const lines = vio.getLines(targetPath);
    const i = utils.lineIndex(lines, new RegExp(`@import +'\\.\\/${oldName}\\.less'`));
    if (i >= 0) {
      lines[i] = `@import './${_.pascalCase(newName)}.less';`;
    }
    vio.save(targetPath, lines);
  },

  addToRoute(feature, component, urlPath, isIndex, name) {
    utils.assertNotEmpty(feature, 'feature');
    utils.assertNotEmpty(component, 'component name');
    utils.assertFeatureExist(feature);

    urlPath = urlPath || _.kebabCase(component);
    const targetPath = utils.mapFile(feature, 'route.js');
    const lines = vio.getLines(targetPath);
    let i = utils.lineIndex(lines, '} from \'./index\';');
    lines.splice(i, 0, `  ${_.pascalCase(component)},`);
    i = utils.lineIndex(lines, 'path: \'*\'');
    if (i === -1) {
      i = utils.lastLineIndex(lines, /^ {2}]/);
    }
    lines.splice(i, 0, `    { path: '${urlPath}', name: '${name || _.upperFirst(_.lowerCase(component))}', component: ${_.pascalCase(component)}${isIndex ? ', isIndex: true' : ''} },`);
    vio.save(targetPath, lines);
  },

  removeFromRoute(feature, component) {
    utils.assertNotEmpty(feature, 'feature');
    utils.assertNotEmpty(component, 'component name');
    utils.assertFeatureExist(feature);

    const targetPath = utils.mapFile(feature, 'route.js');
    const lines = vio.getLines(targetPath);
    utils.removeLines(lines, `  ${_.pascalCase(component)},`);
    const removed = utils.removeLines(lines, new RegExp(`component: ${_.pascalCase(component)}[ ,}]`));
    vio.save(targetPath, lines);
    return removed;
  },

  moveRoute(source, dest) {
    if (source.feature === dest.feature) {
      // If in the same feature, rename imported component name
      const targetPath = utils.mapFile(source.feature, 'route.js');
      const ast = vio.getAst(targetPath);
      const oldName = _.pascalCase(source.name);
      const newName = _.pascalCase(dest.name);
      const changes = [].concat(
        refactor.renameImportSpecifier(ast, oldName, newName),
        refactor.renameStringLiteral(ast, _.kebabCase(oldName), _.kebabCase(newName)), // Rename path
        refactor.renameStringLiteral(ast, _.upperFirst(_.lowerCase(oldName)), _.upperFirst(_.lowerCase(newName))) // Rename name
      );
      const code = refactor.updateSourceCode(vio.getContent(targetPath), changes);
      vio.save(targetPath, code);
    } else {
      const lines = this.removeFromRoute(source.feature, source.name);
      let urlPath = null;
      let isIndex = false;
      let name = null;
      if (lines && lines.length) {
        const m1 = /path: *'([^']+)'/.exec(lines[0]);
        if (m1) {
          urlPath = m1[1];
          if (urlPath === _.kebabCase(source.name)) {
            urlPath = null;
          }
        }
        const m2 = /name: *'([^']+)'/.exec(lines[0]);
        if (m2) {
          name = m2[1];
          if (name === _.upperFirst(_.lowerCase(source.name))) {
            name = null;
          }
        }
        isIndex = /isIndex: true/.test(lines[0]);
      }
      this.addToRoute(dest.feature, dest.name, urlPath, isIndex, name);
    }
  },

  addToActions(feature, name, actionFile) {
    name = _.camelCase(name);
    actionFile = _.camelCase(actionFile || name);
    const targetPath = utils.getReduxFile(feature, 'actions');
    const lines = vio.getLines(targetPath);
    let i = utils.lineIndex(lines, ` from './${actionFile}'`);
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
      i = utils.lastLineIndex(lines, /^export .* from /);
      lines.splice(i + 1, 0, `export { ${name} } from './${actionFile}';`);
    }

    vio.save(targetPath, lines);
  },

  removeFromActions(feature, name, actionFile) {
    name = _.camelCase(name);
    actionFile = _.camelCase(actionFile || name);
    const targetPath = utils.getReduxFile(feature, 'actions');
    const lines = vio.getLines(targetPath);
    if (!name) {
      // Remove all imports from the action
      utils.removeLines(lines, `from './${actionFile}`);
    } else {
      const i = utils.lineIndex(lines, ` from './${actionFile}'`);
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

  renameInActions(feature, oldName, newName) {
    // Rename export { xxx, xxxx } from './xxx'
    oldName = _.camelCase(oldName);
    newName = _.camelCase(newName);
    const targetPath = utils.getReduxFile(feature, 'actions');
    const ast = vio.getAst(targetPath);
    const changes = [].concat(
      refactor.renameExportSpecifier(ast, oldName, newName)
    );
    let code = vio.getContent(targetPath);
    code = refactor.updateSourceCode(code, changes);

    vio.save(targetPath, code);
  },

  addToReducer(feature, action) {
    const targetPath = utils.getReduxFile(feature, 'reducer');
    const lines = vio.getLines(targetPath);
    const camelActionName = _.camelCase(action);
    utils.addImportLine(lines, `import { reducer as ${camelActionName} } from './${camelActionName}';`);
    const i = utils.lineIndex(lines, /^];/, utils.lineIndex(lines, 'const reducers = ['));
    lines.splice(i, 0, `  ${camelActionName},`);

    vio.save(targetPath, lines);
  },

  removeFromReducer(feature, action) {
    const targetPath = utils.getReduxFile(feature, 'reducer');
    const lines = vio.getLines(targetPath);
    const camelActionName = _.camelCase(action);
    utils.removeLines(lines, `from './${camelActionName}'`);
    utils.removeLines(lines, `  ${camelActionName},`, utils.lineIndex(lines, 'const reducers = ['));

    vio.save(targetPath, lines);
  },

  renameInReducer(feature, oldName, newName) {
    const targetPath = utils.getReduxFile(feature, 'reducer');
    const ast = vio.getAst(targetPath);
    oldName = _.camelCase(oldName);
    newName = _.camelCase(newName);
    const changes = [].concat(
      refactor.renameImportSpecifier(ast, oldName, newName),
      refactor.renameStringLiteral(ast, `./${oldName}`, `./${newName}`)
    );
    const code = refactor.updateSourceCode(vio.getContent(targetPath), changes);
    vio.save(targetPath, code);
  },

  addToInitialState(feature, name, value) {
    const targetPath = utils.getReduxFile(feature, 'initialState');
    const lines = vio.getLines(targetPath);
    const i = utils.lastLineIndex(lines, /^\};/);
    lines.splice(i, 0, `  ${name}: ${value},`);

    vio.save(targetPath, lines);
  },

  removeFromInitialState(feature, name) {
    // TODO: currently only supports to remove one line state.
    const targetPath = utils.getReduxFile(feature, 'initialState');
    const lines = vio.getLines(targetPath);
    utils.removeLines(lines, `  ${name}: `);
    vio.save(targetPath, lines);
  },

  renameInInitialState(feature, oldName, newName) {
    // Summary:
    //  Rename initial state property name.

    const targetPath = utils.getReduxFile(feature, 'initialState');
    utils.refactorCode(targetPath, _.partialRight(refactor.renameObjectProperty, oldName, newName));
  },

  addToRootReducer(feature) {
    const targetPath = path.join(utils.getProjectRoot(), 'src/common/rootReducer.js');
    const lines = vio.getLines(targetPath);
    utils.addImportLine(lines, `import ${_.camelCase(feature)}Reducer from '../features/${_.kebabCase(feature)}/redux/reducer';`);
    const i = utils.lastLineIndex(lines, /^\}\);$/, utils.lineIndex(lines, 'const rootReducer = combineReducers({'));
    lines.splice(i, 0, `  ${_.camelCase(feature)}: ${_.camelCase(feature)}Reducer,`);

    vio.save(targetPath, lines);
  },

  removeFromRootReducer(feature) {
    // NOTE: currently only used by feature
    const targetPath = path.join(utils.getProjectRoot(), 'src/common/rootReducer.js');
    const lines = vio.getLines(targetPath);
    utils.removeLines(lines, `'../features/${_.kebabCase(feature)}/redux/reducer';`);
    utils.removeLines(lines, `: ${_.camelCase(feature)}Reducer,`);

    vio.save(targetPath, lines);
  },

  renameInRootReducer(oldName, newName) {
    this.removeFromRootReducer(oldName);
    this.addToRootReducer(newName);
  },

  addToRouteConfig(feature) {
    const targetPath = path.join(utils.getProjectRoot(), 'src/common/routeConfig.js');
    const lines = vio.getLines(targetPath);
    utils.addImportLine(lines, `import ${_.camelCase(feature)}Route from '../features/${_.kebabCase(feature)}/route';`);
    let i = utils.lineIndex(lines, 'path: \'*\'');
    // istanbul ignore if
    if (i === -1) {
      i = utils.lastLineIndex(lines, /^ {2}]/);
    }
    lines.splice(i, 0, `    ${_.camelCase(feature)}Route,`);

    vio.save(targetPath, lines);
  },

  renameInRouteConfig(oldName, newName) {
    this.removeFromRouteConfig(oldName);
    this.addToRouteConfig(newName);
  },

  removeFromRouteConfig(feature) {
    const targetPath = path.join(utils.getProjectRoot(), 'src/common/routeConfig.js');
    const lines = vio.getLines(targetPath);
    utils.removeLines(lines, `import ${_.camelCase(feature)}Route from '../features/${_.kebabCase(feature)}/route';`);
    utils.removeLines(lines, `    ${_.camelCase(feature)}Route,`);

    vio.save(targetPath, lines);
  },

  addToRootStyle(feature) {
    const targetPath = path.join(utils.getProjectRoot(), 'src/styles/index.less');
    const lines = vio.getLines(targetPath);
    const i = utils.lastLineIndex(lines, '@import ');
    lines.splice(i + 1, 0, `@import '../features/${_.kebabCase(feature)}/style.less';`);

    vio.save(targetPath, lines);
  },

  removeFromRootStyle(feature) {
    const targetPath = path.join(utils.getProjectRoot(), 'src/styles/index.less');
    const lines = vio.getLines(targetPath);
    utils.removeLines(lines, `features/${_.kebabCase(feature)}/style.less';`);

    vio.save(targetPath, lines);
  },

  renameInRootStyle(oldName, newName) {
    const targetPath = path.join(utils.getProjectRoot(), 'src/styles/index.less');
    const lines = vio.getLines(targetPath);
    const i = utils.lineIndex(lines, `features/${_.kebabCase(oldName)}/style.less';`);
    if (i >= 0) {
      lines[i] = `@import '../features/${_.kebabCase(newName)}/style.less';`;
    } else {
      this.addToRootStyle(newName);
    }
    vio.save(targetPath, lines);
  },
};
