'use strict';

/**
 * The default module of the rekit-core package. It does two things:
 *
 * 1. Wraps modularized APIs to Rekit core commands.
 * 2. Exports other modules. i.e. `require('rekit-core').component` equals to `require('rekit-core/component')`.
 *
 * @module rekit-core
**/

/**
 * The combination of feature and name of an element like component.
 * @typedef {Object} ElementArg
 * @property {string} feature - The feature of the element.
 * @property {string} name - The name of the element.
 * @alias module:rekit-core.ElementArg
 */

const _ = require('lodash');

/**
 * Quick access to rekit-core/app.
 * @alias module:rekit-core.app
**/
const app = require('./app');

/**
 * Quick access to rekit-core/component.
 * @alias module:rekit-core.component
**/
const component = require('./component');

/**
 * Quick access to rekit-core/style.
 * @alias module:rekit-core.style
**/
const style = require('./style');

/**
 * Quick access to rekit-core/test.
 * @alias module:rekit-core.test
**/
const test = require('./test');

/**
 * Quick access to rekit-core/action.
 * @alias module:rekit-core.action
**/
const action = require('./action');

/**
 * Quick access to rekit-core/feature.
 * @alias module:rekit-core.feature
**/
const featureMgr = require('./feature');

/**
 * Quick access to rekit-core/utils.
 * @alias module:rekit-core.utils
**/
const utils = require('./utils');

/**
 * Quick access to rekit-core/vio.
 * @alias module:rekit-core.vio
**/
const vio = require('./vio');

/**
 * Quick access to rekit-core/vio.
 * @alias module:rekit-core.vio
**/
const refactor = require('./refactor');
const entry = require('./entry');
const route = require('./route');
const template = require('./template');
const plugin = require('./plugin');
const constant = require('./constant');

const injectExtensionPoints = plugin.injectExtensionPoints;

/**
 * Add a component including unit test and style files. It wraps APIs from `component`, `style` and `test`.
 *
 * @param {string} feature - the feature where to create the component.
 * @param {string} name - the component name, will be converted to pascal case.
 * @param {object} args - other args.
 * @alias module:rekit-core.addComponent
 *
 * @example <caption>Create a container component</caption>
 * const rekitCore = require('rekit-core');
 *
 * // Add a component named 'TopicList' which is connected to Redux store.
 * rekitCore.addComponent('home', 'topic-list', { connect: true });
 *
 * // Write the changes to disk. Otherwise only in memory, see more at rekitCore/vio
 * rekitCore.vio.flush();
**/
function addComponent(feature, name, args) {
  feature = _.kebabCase(feature);
  name = _.pascalCase(name);

  args = args || {};
  component.add(feature, name, {
    templateFile: args.connect ? 'ConnectedComponent.js' : 'Component.js',
  });
  if (args.urlPath) {
    let urlPath = args.urlPath;
    if (urlPath === '$auto') urlPath = _.kebabCase(name);
    route.add(feature, name, { urlPath, isIndex: !!args.isIndex });
  }
  style.add(feature, name);
  test.add(feature, name, {
    templateFile: args.connect ? 'ConnectedComponent.test.js' : 'Component.test.js',
  });
}

/**
 * Remove a component including unit test and style files. It wraps APIs from `component`, `style` and `test`.
 *
 * @param {string} feature - the feature where to create the component.
 * @param {string} name - the component name, will be converted to pascal case.
 * @alias module:rekit-core.removeComponent
 *
 * @example <caption>Remove a container component</caption>
 * const rekitCore = require('rekit-core');
 *
 * // Remove a component named 'TopicList' which is connected to Redux store.
 * rekitCore.removeComponent('home', 'topic-list');
 *
 * // Write the changes to disk. Otherwise only in memory, see more at rekitCore/vio
 * rekitCore.vio.flush();
**/
function removeComponent(feature, name) {
  feature = _.kebabCase(feature);
  name = _.pascalCase(name);
  component.remove(feature, name);
  route.remove(feature, name);
  style.remove(feature, name);
  test.remove(feature, name);
}

/**
 * Move/rename a component including unit test and style files. It wraps APIs from `component`, `style` and `test`.
 *
 * @param {object} source - which component to be moved, in form of { name: {string}, feature: {string} }.
 * @param {object} target - where to move, in form of { name: {string}, feature: {string} }.
 * @alias module:rekit-core.moveComponent
 *
 * @example <caption>Rename TopicList to Topics</caption>
 * const rekitCore = require('rekit-core');
 *
 * // Rename the component from 'TopicList' to 'Topics'
 * rekitCore.moveComponent({ feautre: 'home', name: 'topic-list' }, { feautre: 'home', name: 'topics' });
 *
 * // Write the changes to disk. Otherwise only in memory, see more at rekitCore/vio
 * rekitCore.vio.flush();
**/
function moveComponent(source, target) {
  source.feature = _.kebabCase(source.feature);
  source.name = _.pascalCase(source.name);
  target.feature = _.kebabCase(target.feature);
  target.name = _.pascalCase(target.name);

  component.move(source, target);
  test.move(source, target);
  style.move(source, target);
  route.move(source, target);
}

/**
 * Add an async action using redux-thunk and its unit test.
 *
 * @param {string} feature - the feature where to create the action.
 * @param {string} name - the action name, will be converted to camel case.
 * @alias module:rekit-core.addAsyncAction
 *
**/
function addAsyncAction(feature, name) {
  action.addAsync(feature, name);
  test.addAction(feature, name, { isAsync: true });
}

/**
 * Remove an async action and its unit test.
 *
 * @param {string} feature - the feature of the action.
 * @param {string} name - the action name, will be converted to camel case.
 * @alias module:rekit-core.removeAsyncAction
 *
**/
function removeAsyncAction(feature, name) {
  action.removeAsync(feature, name);
  test.removeAction(feature, name);
}

/**
 * Move/rename an async action including unit test.
 *
 * @param {ElementArg} source - Which action to be moved.
 * @param {ElementArg} target - Where to move.
 * @alias module:rekit-core.moveAsyncAction
 *
**/
function moveAsyncAction(source, target) {
  action.moveAsync(source, target);
  test.moveAction(source, target, { isAsync: true });
}

/**
 * Add an action and its unit test.
 *
 * @param {string} feature - the feature where to create the action.
 * @param {string} name - the action name, will be converted to camel case.
 * @alias module:rekit-core.addAction
 *
**/
function addAction(feature, name, args) {
  args = args || {};
  if (args.async) {
    addAsyncAction(feature, name);
    return;
  }
  action.add(feature, name);
  test.addAction(feature, name);
}

/**
 * Remove an action and its unit test.
 *
 * @param {string} feature - the feature of the action.
 * @param {string} name - the action name, will be converted to camel case.
 * @alias module:rekit-core.removeAction
 *
**/
function removeAction(feature, name) {
  const targetPath = utils.mapReduxFile(feature, name);
  if (_.get(app.getRekitProps(targetPath), 'action.isAsync')) {
    removeAsyncAction(feature, name);
    return;
  }
  action.remove(feature, name);
  test.removeAction(feature, name);
}

/**
 * Move/rename an action including unit test.
 *
 * @param {object} source - which action to be moved, in form of { name: {string}, feature: {string} }.
 * @param {object} target - where to move, in form of { name: {string}, feature: {string} }.
 * @alias module:rekit-core.moveAction
 *
**/
function moveAction(source, target) {
  const targetPath = utils.mapReduxFile(source.feature, source.name);
  if (_.get(app.getRekitProps(targetPath), 'action.isAsync')) {
    moveAsyncAction(source, target);
    return;
  }
  action.move(source, target);
  test.moveAction(source, target);
}

/**
 * Add a feature with one sample component. Besides creating feature folder and files,
 * it also registers reducer, router config, style to root config of the app.
 *
 * @param {string} name - the feature name.
 * @alias module:rekit-core.addFeature
 *
**/
function addFeature(name) {
  featureMgr.add(name);
  entry.addToRootReducer(name);
  entry.addToRouteConfig(name);
  entry.addToRootStyle(name);

  // Add default page and sample action
  addComponent(name, 'default-page', { isIndex: true, connect: true, urlPath: '$auto' });
}

/**
 * Remove a feature.
 *
 * @param {string} name - the feature name.
 * @alias module:rekit-core.removeFeature
 *
**/
function removeFeature(name) {
  featureMgr.remove(name);
  entry.removeFromRootReducer(name);
  entry.removeFromRouteConfig(name);
  entry.removeFromRootStyle(name);
}

/**
 * Rename a feature
 *
 * @param {string} oldName - Old name of the feature.
 * @param {string} newName - New name of the feature.
 * @alias module:rekit-core.moveFeature
 *
**/
function moveFeature(oldName, newName) {
  featureMgr.move(oldName, newName);
}

const coreCommands = {
  addComponent: injectExtensionPoints(addComponent, 'add', 'component'),
  removeComponent: injectExtensionPoints(removeComponent, 'remove', 'component'),
  moveComponent: injectExtensionPoints(moveComponent, 'move', 'component'),
  addAction: injectExtensionPoints(addAction, 'add', 'action'),
  removeAction: injectExtensionPoints(removeAction, 'remove', 'action'),
  moveAction: injectExtensionPoints(moveAction, 'move', 'action'),
  addAsyncAction: injectExtensionPoints(addAsyncAction, 'add', 'async-action'),
  removeAsyncAction: injectExtensionPoints(removeAsyncAction, 'remove', 'async-action'),
  moveAsyncAction: injectExtensionPoints(moveAsyncAction, 'move', 'async-action'),
  addFeature: injectExtensionPoints(addFeature, 'add', 'feature'),
  removeFeature: injectExtensionPoints(removeFeature, 'remove', 'feature'),
  moveFeature: injectExtensionPoints(moveFeature, 'move', 'feature'),
};

function splitName(name) {
  const arr = name.split('/');
  return {
    feature: arr[0],
    name: arr[1],
  };
}

/**
 * Handle the parse result of Rekit command, like `rekit add component home/hello`.
 * @alias module:rekit-core.handleCommand
**/
function handleCommand(args) {
  const params = [];
  switch (args.commandName) {
    case 'add':
    case 'remove': {
      if (args.type === 'feature') params.push(args.name);
      else {
        params.push(splitName(args.name).feature);
        params.push(splitName(args.name).name);
      }
      break;
    }
    case 'move': {
      if (args.type === 'feature') {
        params.push(args.source);
        params.push(args.target);
      } else {
        params.push(splitName(args.source));
        params.push(splitName(args.target));
      }
      break;
    }
    default:
      break;
  }
  params.push(args);

  let cmd = plugin.getCommand(args.commandName, args.type);
  if (!cmd) {
    cmd = coreCommands[_.camelCase(args.commandName + '-' + args.type)];
  }

  if (!cmd) {
    utils.fatalError(`Can't find the desired command: ${args.commandName}`);
  }
  cmd.apply(null, params);
}

module.exports = Object.assign({
  app,
  vio,
  refactor,
  utils,
  component,
  constant,
  style,
  test,
  action,
  template,
  feature: featureMgr,
  entry,
  route,
  plugin,

  handleCommand,
}, coreCommands);

// NOTE: plugin.loadPlutins should be executed after module.exports to avoid circular dependency
// plugin.loadPlugins();
