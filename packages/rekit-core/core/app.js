'use strict';

/**
 * Get basic application data. Such as components, actions, etc.
 * @module
 **/

const _ = require('lodash');
const mPath = require('path');
const shell = require('shelljs');
const traverse = require('babel-traverse').default;
const vio = require('./vio');
const utils = require('./utils');
const refactor = require('./refactor');

const propsCache = {};
const depsCache = {};
function getRekitProps(file) {
  if (propsCache[file] && propsCache[file].content === vio.getContent(file)) {
    return propsCache[file].props;
  }
  const isInFeature = /src\/features\/\w+\//.test(file);
  if (!isInFeature) {
    // all files not under a feature are misc
    const props = { type: 'misc' };
    propsCache[file] = {
      content: vio.getContent(file),
      props,
    };
    return props;
  }

  const ast = vio.getAst(file);
  const ff = {}; // File features

  traverse(ast, {
    ImportDeclaration(path) {
      switch (path.node.source.value) {
        case 'react':
          ff.importReact = true;
          break;
        case 'redux':
          ff.importRedux = true;
          break;
        case 'react-redux':
          ff.importReactRedux = true;
          break;
        case './constants':
          ff.importConstant = true;
          ff.importMultipleConstants = path.node.specifiers.length > 3;
          break;
        default:
          break;
      }
    },
    ClassDeclaration(path) {
      if (path.node.superClass && path.node.body.body.some(n => n.type === 'ClassMethod' && n.key.name === 'render')) {
        ff.hasClassAndRenderMethod = true;
      }
    },
    CallExpression(path) {
      if (path.node.callee.name === 'connect') {
        ff.connectCall = true;
      }
    },
    ExportNamedDeclaration(path) {
      if (_.get(path, 'node.declaration.id.name') === 'reducer') {
        ff.exportReducer = true;
      }
    },
  });
  const props = {
    component: ff.importReact &&
      ff.hasClassAndRenderMethod && {
        connectToStore: ff.connectCall,
      },
    action: ff.exportReducer &&
      ff.importConstant && {
        isAsync: ff.importMultipleConstants,
      },
  };

  if (props.component) props.type = 'component';
  else if (props.action) props.type = 'action';
  else props.type = 'misc';

  propsCache[file] = {
    content: vio.getContent(file),
    props,
  };
  return props;
}

/**
 * Get all features names (folder names).
 */
function getFeatures() {
  return _.toArray(shell.ls(utils.joinPath(utils.getProjectRoot(), 'src/features')));
}

/**
 * Get root route rules defined in src/common/routeConfig.js.
 */
function getRootRoutePath() {
  const targetPath = utils.mapSrcFile('common/routeConfig.js');
  const ast = vio.getAst(targetPath);
  let rootPath = '';
  traverse(ast, {
    ObjectExpression(path) {
      const node = path.node;
      const props = node.properties;
      if (!props.length) return;
      const obj = {};
      props.forEach(p => {
        if (_.has(p, 'key.name') && !p.computed) {
          obj[p.key.name] = p;
        }
      });
      if (obj.path && obj.childRoutes && !rootPath) {
        rootPath = _.get(obj.path, 'value.value');
      }
    },
  });
  return rootPath;
}

/**
 * Get route rules defined in a feature.
 * @param {string} feature - The feature name.
 */
function getFeatureRoutes(feature) {
  const targetPath = utils.mapFeatureFile(feature, 'route.js');
  const ast = vio.getAst(targetPath);
  const arr = [];
  let rootPath = '';
  let indexRoute = null;

  traverse(ast, {
    ObjectExpression(path) {
      const node = path.node;
      const props = node.properties;
      if (!props.length) return;
      const obj = {};
      props.forEach(p => {
        if (_.has(p, 'key.name') && !p.computed) {
          obj[p.key.name] = p;
        }
      });
      if (obj.path && obj.component) {
        // in a route config, if an object expression has both 'path' and 'component' property, then it's a route config
        arr.push({
          path: _.get(obj.path, 'value.value'), // only string literal supported
          component: _.get(obj.component, 'value.name'), // only identifier supported
          isIndex: !!obj.isIndex && _.get(obj.isIndex, 'value.value'), // suppose to be boolean
          node: {
            start: node.start,
            end: node.end,
          },
        });
      }
      if (obj.isIndex && obj.component && !indexRoute) {
        // only find the first index route
        indexRoute = {
          component: _.get(obj.component, 'value.name'),
        };
      }
      if (obj.path && obj.childRoutes && !rootPath) {
        rootPath = _.get(obj.path, 'value.value');
        if (!rootPath) rootPath = '$none'; // only find the first rootPath
      }
    },
  });
  const prjRootPath = getRootRoutePath();
  if (rootPath === '$none') rootPath = prjRootPath;
  else if (!/^\//.test(rootPath)) rootPath = prjRootPath + '/' + rootPath;
  rootPath = rootPath.replace(/\/+/, '/');
  arr.forEach(item => {
    if (!/^\//.test(item.path)) {
      item.path = (rootPath + '/' + item.path).replace(/\/+/, '/');
    }
  });
  if (indexRoute) {
    indexRoute.path = rootPath;
    arr.unshift(indexRoute);
  }
  return arr;
}

/**
 * Get feature's components, actions, misc files and their dependencies.
 **/
function getFeatureStructure(feature) {
  const dir = utils.joinPath(utils.getProjectRoot(), 'src/features', feature);
  const noneMisc = {};

  const components = shell
    .ls(dir + '/*.js')
    .map(file => {
      const props = getRekitProps(file);
      if (props && props.component) {
        noneMisc[file] = true;
        noneMisc[file.replace('.js', '.less')] = true;
        noneMisc[file.replace('.js', '.scss')] = true;
        return Object.assign(
          {
            feature,
            name: mPath.basename(file).replace('.js', ''),
            type: 'component',
            file,
          },
          props.component
        );
      }
      return null;
    })
    .filter(item => !!item)
    .sort((a, b) => a.name.localeCompare(b.name));

  const actions = shell
    .ls(dir + '/redux/*.js')
    .map(file => {
      const props = getRekitProps(file);
      if (props && props.action) {
        noneMisc[file] = true;
        return Object.assign(
          {
            feature,
            name: mPath.basename(file).replace('.js', ''),
            type: 'action',
            file,
          },
          props.action
        );
      }
      return null;
    })
    .filter(item => !!item)
    .sort((a, b) => a.name.localeCompare(b.name));

  function getMiscFiles(root) {
    const arr = [];
    shell.ls(root).forEach(file => {
      const fullPath = utils.joinPath(root, file);
      if (shell.test('-d', fullPath)) {
        // is directory
        arr.push({
          feature,
          name: mPath.basename(fullPath),
          type: 'misc',
          file: fullPath,
          children: getMiscFiles(fullPath),
        });
      } else if (!noneMisc[fullPath]) {
        arr.push({
          feature,
          type: 'misc',
          name: mPath.basename(fullPath),
          file: fullPath,
        });
      }
    });
    return arr.sort((a, b) => {
      if (a.children && !b.children) return -1;
      if (!a.children && b.children) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  return {
    actions,
    components,
    routes: getFeatureRoutes(feature),
    misc: getMiscFiles(dir),
  };
}

// Check a file if it's 'feature/redux/actions.js'.
function isActionEntry(modulePath) {
  return /src\/features\/[^/]+\/redux\/actions\.js$/.test(modulePath);
}

// Check a file if it's 'feature/index.js'
function isFeatureIndex(modulePath) {
  return /src\/features\/[^/]+(\/|\/index)?$/.test(modulePath);
}

// Check a file if it's 'feature/redux/constants.js'
function isConstantEntry(modulePath) {
  return /src\/features\/[^/]+\/redux\/constants\.js$/.test(modulePath);
}

function getEntryData(filePath) {
  // Summary:
  //  Get entry files content such as actions.js, index.js where usually define 'export { aaa, bbb } from 'xxx';

  const ast = vio.getAst(filePath);
  const feature = utils.getFeatureName(filePath); // many be empty
  const data = {
    file: filePath,
    feature,
    bySource: {},
    exported: {},
  };
  traverse(ast, {
    ExportNamedDeclaration(path) {
      const node = path.node;
      if (!node.source || !node.source.value) return;
      const sourceFile = `${refactor.resolveModulePath(filePath, node.source.value)}.js`; // from which file
      const specifiers = {};
      node.specifiers.forEach(specifier => {
        specifiers[specifier.exported.name] = (specifier.local && specifier.local.name) || true;
        data.exported[specifier.exported.name] = sourceFile;
      });
      data.bySource[sourceFile] = specifiers;
    },
  });
  return data;
}

/**
 * Get dependencies of a module by path.
 * @param {string} modulePath - The full path of the module.
 * @alias module:app.getDeps
 **/
function getDeps(filePath) {
  // Summary:
  //   Get dependencies of a module

  if (depsCache[filePath] && depsCache[filePath].content === vio.getContent(filePath)) {
    return depsCache[filePath].deps;
  }

  const ast = vio.getAst(filePath);

  const deps = {
    actions: [],
    components: [],
    misc: [],
    constants: [],
  };

  const namespaceActions = {}; // import * as xxx from 'actions';
  const namespaceIndex = {}; // import * as xxx from 'feature';

  function pushDep(type, data) {
    // Be sure no duplicated deps
    const exist = _.find(deps[type], { feature: data.feature, name: data.name });
    if (!exist) {
      deps.actions.push(data);
    }
  }

  const depFiles = [];

  traverse(ast, {
    ExportNamedDeclaration(path) {
      const depModule = _.get(path, 'node.source.value');
      if (!depModule || !refactor.isLocalModule(depModule)) return;
      const resolvedPath = refactor.resolveModulePath(filePath, depModule);
      // if (!isLocalModule(depModule)) return;
      const fullPath = resolvedPath + '.js';
      if (!shell.test('-e', fullPath)) return; // only depends on js modules, no json or other support
      depFiles.push({
        name: mPath.basename(resolvedPath),
        file: fullPath,
      });
    },
    CallExpression(path) {
      if (_.get(path, 'node.callee.type') !== 'Import') return;
      const source = _.get(path, 'node.arguments[0].value');
      if (!source) return;
      const resolvedPath = refactor.resolveModulePath(filePath, source);
      const fullPath = resolvedPath + '.js';
      if (!shell.test('-e', fullPath)) return; // only depends on js modules, no json or other support
      depFiles.push({
        name: mPath.basename(resolvedPath),
        file: fullPath,
        dynamic: true,
      });
    },
    ImportDeclaration(path) {
      const node = path.node;
      const depModule = node.source.value;
      const resolvedPath = refactor.resolveModulePath(filePath, depModule);
      // Only show deps of local modules
      if (!refactor.isLocalModule(depModule)) return;
      if (isFeatureIndex(resolvedPath)) {
        // Import from feature index
        const indexFile = resolvedPath + '.js';
        // if (!/index$/.test(indexFile)) {
        //   indexFile = utils.joinPath(resolvedPath, 'index');
        // }
        // indexFile += '.js';

        const indexEntry = getEntryData(indexFile);
        node.specifiers.forEach(specifier => {
          if (specifier.type === 'ImportNamespaceSpecifier') {
            namespaceIndex[specifier.local.name] = indexEntry;
            return;
          }

          const importedName = specifier.imported.name;
          if (!indexEntry.exported[importedName]) {
            utils.warn(`Warning: can't find '${importedName}' from '${indexFile}'`);
            return;
          }

          depFiles.push({
            name: importedName,
            file: indexEntry.exported[importedName],
          });
        });
        return;
      }

      const fullPath = resolvedPath + '.js';
      if (!shell.test('-e', fullPath)) return; // only depends on js modules, no json or other support

      // Import from actions
      if (isActionEntry(fullPath)) {
        const actionEntry = getEntryData(fullPath); // getActionEntry(utils.getFeatureName(fullPath));

        node.specifiers.forEach(specifier => {
          if (specifier.type === 'ImportNamespaceSpecifier') {
            namespaceActions[specifier.local.name] = actionEntry;
            return;
          }

          const importedName = specifier.imported.name;
          if (!actionEntry.exported[importedName]) {
            utils.warn(`Warning: can't find '${importedName}' from '${fullPath}'`);
            return;
          }

          pushDep('actions', {
            feature: actionEntry.feature,
            type: 'action',
            name: importedName,
            file: actionEntry.exported[importedName],
          });
        });
        return;
      }

      if (isConstantEntry(fullPath)) {
        node.specifiers.forEach(specifier => {
          deps.constants.push({
            name: specifier.imported.name,
            feature: utils.getFeatureName(fullPath),
            file: fullPath,
            type: 'constant',
          });
        });
        return;
      }

      depFiles.push({
        name: mPath.basename(resolvedPath),
        file: resolvedPath + '.js',
      });
    },

    MemberExpression(path) {
      // Find actions imported by NamespaceImport
      const node = path.node;
      const objName = _.get(node, 'object.property.name') || _.get(node, 'object.name'); // this.props.'actions'.fetchNavTree
      const propName = _.get(node, 'property.name'); // this.props.actions.'fetchNavTree'
      if (!objName || !propName) return;
      if (_.has(namespaceActions, objName)) {
        const actionEntry = namespaceActions[objName];
        if (!actionEntry.exported[propName]) return;

        pushDep('actions', {
          feature: actionEntry.feature,
          type: 'action',
          name: propName,
          file: actionEntry.exported[propName],
        });
      } else if (_.has(namespaceIndex, objName)) {
        const indexEntry = namespaceIndex[objName];
        if (!indexEntry.exported[propName]) return;
        depFiles.push({
          name: propName,
          file: indexEntry.exported[propName],
        });
      }
    },
  });

  depFiles.forEach(item => {
    const props = getRekitProps(item.file);
    // Other files
    if (props.component) {
      const feature = utils.getFeatureName(item.file);
      if (feature && !_.find(deps.component, { feature, name: item.name })) {
        deps.components.push({
          feature,
          type: 'component',
          name: item.name,
          file: item.file,
        });
      }
    } else {
      deps.misc.push({
        feature: utils.getFeatureName(item.file) || null,
        type: 'misc',
        name: mPath.basename(item.file),
        file: item.file,
      });
    }
  });

  depsCache[filePath] = {
    content: vio.getContent(filePath),
    deps,
  };
  return deps;
}

/**
 * Get src files excepts features of a Rekit project.
 **/
function getSrcFiles(dir) {
  // Summary
  //  Get files under src exclues features folder
  const prjRoot = utils.getProjectRoot();
  if (!dir) dir = utils.joinPath(prjRoot, 'src');

  return _.toArray(shell.ls(dir))
    .filter(file => utils.joinPath(prjRoot, 'src/features') !== utils.joinPath(dir, file)) // exclude features folder
    .map(file => {
      file = utils.joinPath(dir, file);
      if (shell.test('-d', file)) {
        return {
          name: mPath.basename(file),
          type: 'misc',
          feature: null,
          file,
          children: getSrcFiles(file),
        };
      }
      let rekitProps = {};
      let deps = null;
      if (/\.js$/.test(file)) {
        rekitProps = getRekitProps(file);
        deps = getDeps(file);
      }
      return {
        name: mPath.basename(file),
        type: rekitProps.component ? 'component' : 'misc',
        feature: null,
        deps,
        file,
      };
    })
    .sort((a, b) => {
      if (a.children && !b.children) return -1;
      else if (!a.children && b.children) return 1;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
}

module.exports = {
  getRekitProps,
  getFeatures,
  getFeatureStructure,
  getDeps,
  getSrcFiles,
};
