/* eslint no-console: 0 */

'use strict';

/**
 * The common utility module. It provides various tools for managing a Rekit app.
 * @module
**/

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const colors = require('colors/safe');

let silent = false;

// NOTE: utils is just assumed to always be loaded before lodash is used...
_.pascalCase = _.flow(_.camelCase, _.upperFirst);
_.upperSnakeCase = _.flow(_.snakeCase, _.toUpper);

/**
 * Don't output any logs.
 * @param {boolean} isSilent - Whether to output logs.

 * @alias module:utils.setSilent
 *
**/
function setSilent(isSilent) {
  silent = isSilent;
}

/**
 * The unified version of 'path.join'. It forces forward slash ('/') on both unix like or windows system.
 * It also normalizes the path to emmit double slash and '..'.

 * @alias module:utils.joinPath
 *
 * @example
 * const utils = require('rekit-core').utils;
 * const p1 = utils.joinPath('c:\\abc', '../def');
 * // p1 => 'c:/def'
**/
function joinPath() {
  // A consistent and normalized version of path.join cross platforms
  return path.normalize(path.join.apply(path, arguments)).replace(/\\/g, '/');
}

/**
 * Log a message to console. It respects the setSilent switch.
 * @param {string} msg - The message to log.
**/
function log(msg) {
  if (!silent) console.log(msg);
}

/**
 * Log a warning message to console. It respects the setSilent switch.
 * @param {string} msg - The message to log.
**/
function warn(msg) {
  if (!silent) console.log(colors.yellow('Warning: ' + msg));
}

/**
 * Log an error message to console. It respects the setSilent switch.
 * @param {string} msg - The message to log.
**/
function error(msg) {
  if (!silent) console.log(colors.red('Error: ' + msg));
}

/**
 * Throw a fatal error and log an error message.
 * @param {string} msg - The message to log.
**/
function fatalError(msg) {
  error(msg);
  throw new Error(msg);
}

let prjRoot;

/**
 * By default Rekit will try to find the current Rekit project root. But you can also manually set it by calling this method.
 * @param {string} root - The project root.
**/
function setProjectRoot(root) {
  prjRoot = /\/$/.test(root) ? root : (root + '/');
  prjRoot = joinPath(prjRoot);
}

/**
 * Get the project root. By default it finds the Rekit project root of which the command is run.
**/
function getProjectRoot() {
  if (!prjRoot) {
    let cwd = process.cwd();
    let lastDir = null;
    // Traverse above until find the package.json.
    while (cwd && lastDir !== cwd) {
      const pkgPath = joinPath(cwd, 'package.json');
      if (shell.test('-e', pkgPath) && require(pkgPath).rekit) { // eslint-disable-line
        prjRoot = cwd;
        break;
      }
      lastDir = cwd;
      cwd = joinPath(cwd, '..');
    }
  }
  return joinPath(/\/$/.test(prjRoot) ? prjRoot : (prjRoot + '/'));
}

let pkgJson = null;
/**
 * Get the current project's package.json.
**/
function getPkgJson() {
  // Get the project package json
  if (!pkgJson) {
    const pkgJsonPath = joinPath(getProjectRoot(), 'package.json');
    pkgJson = require(pkgJsonPath);
  }
  return pkgJson;
}

/**
 * Set the current project's package.json.
**/
function setPkgJson(obj) {
  // Only used for unit test purpose
  pkgJson = obj;
}

/**
 * Get the relative path to the project root by given full path.
 * @param {string} fullPath - A full path string.
**/
function getRelativePath(fullPath) {
  // Get rel path relative to project root.
  const _prjRoot = getProjectRoot();
  const regExp = new RegExp(`^${_.escapeRegExp(_prjRoot)}`, 'i');
  return fullPath.replace(regExp, '');
}

/**
 * Get the full path of a relative path to the project root.
 * @param {string} relPath - The relative path.
**/
function getFullPath(relPath) {
  const _prjRoot = getProjectRoot();
  const regExp = new RegExp(`^${_.escapeRegExp(_prjRoot)}`, 'i');
  return regExp.test(relPath) ? relPath : joinPath(_prjRoot, relPath);
}

/**
 * Get action type constant for a sync action. It uses UPPER_SNAKE_CASE and combines feature name and action name.
 * @param {string} feature - The feature name of the action.
 * @param {string} action - The action name.
 *
 * @example
 * const utils = require('rekit-core').utils;
 * utils.getActionType('home', 'doSomething');
 * // => HOME_DO_SOMETHING
**/
function getActionType(feature, action) {
  return `${_.upperSnakeCase(feature)}_${_.upperSnakeCase(action)}`;
}

/**
 * Get action type constants for an async action. It uses UPPER_SNAKE_CASE and combines feature name and action name.
 * @param {string} feature - The feature name of the action.
 * @param {string} action - The action name.
 *
 * @example
 * const utils = require('rekit-core').utils;
 * utils.getAsyncActionTypes('home', 'doAsync');
 * // =>
 * // {
 * //   doAsyncBegin: 'HOME_DO_ASYNC_BEGIN',
 * //   doAsyncSuccess: 'HOME_DO_ASYNC_SUCCESS',
 * //   doAsyncFailure: 'HOME_DO_ASYNC_FAILURE',
 * //   doAsyncDismissError: 'HOME_DO_ASYNC_DISMISS_ERROR',
 * // }
**/
function getAsyncActionTypes(feature, action) {
  return {
    normal: getActionType(feature, action),
    begin: `${_.upperSnakeCase(feature)}_${_.upperSnakeCase(action)}_BEGIN`,
    success: `${_.upperSnakeCase(feature)}_${_.upperSnakeCase(action)}_SUCCESS`,
    failure: `${_.upperSnakeCase(feature)}_${_.upperSnakeCase(action)}_FAILURE`,
    dismissError: `${_.upperSnakeCase(feature)}_${_.upperSnakeCase(action)}_DISMISS_ERROR`,
  };
}

/**
 * Get the full path by a relative path to 'src'.
 * @param {string} filePath - The file path relative to project's 'src' folder.
 * @alias module:utils.mapSrcFile
 *
 * @example
 * const utils =require('rekit-core').utils;
 * utils.mapSrcFile('common/configStore.js');
 * // => /path/to/project/src/common/configStore.js
**/
function mapSrcFile(filePath) {
  return joinPath(getProjectRoot(), 'src', filePath);
}

function mapFeatureFile(feature, fileName) {
  return joinPath(getProjectRoot(), 'src/features', _.kebabCase(feature), fileName);
}

function mapTestFile(feature, fileName) {
  return joinPath(getProjectRoot(), 'tests/features', _.kebabCase(feature), fileName);
}

function mapComponent(feature, name) {
  // Map a component, page name to the file.
  return mapFeatureFile(feature, _.pascalCase(name));
}

function mapReduxFile(feature, name) {
  return mapFeatureFile(feature, 'redux/' + _.camelCase(name) + '.js');
}

function mapReduxTestFile(feature, name) {
  return mapTestFile(feature, 'redux/' + _.camelCase(name) + '.test.js');
}

function mapComponentTestFile(feature, name) {
  return mapTestFile(feature, _.pascalCase(name) + '.test.js');
}

function getFeatures() {
  return _.toArray(shell.ls(joinPath(getProjectRoot(), 'src/features')));
}

function getCssExt() {
  const pkgPath = joinPath(getProjectRoot(), 'package.json');
  const pkg = require(pkgPath); // eslint-disable-line
  return (pkg && pkg.rekit && pkg.rekit.css === 'sass') ? 'scss' : 'less';
}

function getFeatureName(filePath) {
  const relPath = getRelativePath(filePath);
  let name = null;

  if (_.startsWith(relPath, 'src/features')) {
    name = relPath.split('/')[2];
  }
  return name;
}

module.exports = {
  getCssExt,
  setProjectRoot,
  getProjectRoot,
  getPkgJson,
  setPkgJson,
  getRelativePath,
  getFullPath,
  getActionType,
  getAsyncActionTypes,
  mapSrcFile,
  mapComponent,
  mapReduxFile,
  mapReduxTestFile,
  mapFeatureFile,
  mapTestFile,
  mapComponentTestFile,
  joinPath,
  getFeatures,
  fatalError,
  setSilent,
  log,
  warn,
  error,

  getFeatureName,
};
