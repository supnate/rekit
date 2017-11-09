'use strict';

/**
 * Constant manager. It manages all constants of a feature. Constants are very useful for the communication between actions and reducers.
 * They may be used across features.
 * This constant manager exports APIs to create/rename/remove constants. Usually used with the action manager as Rekit does.
 * @module
**/

const _ = require('lodash');
const utils = require('./utils');
const refactor = require('./refactor');
const vio = require('./vio');

/**
 * Add a constant definition to a feature's `redux/constants.js` file, it forces UPPER_SNAKE_CASE.
 * @param {string} feature - The feature name.
 * @param {string} name - The component name.
 * @alias module:constant.add
 *
 * @example <caption>Add a new constant</caption>
 * const constant = require('rekit-core').constant;
 *
 * // Define a new constant named 'FETCH_TOPIC_LIST_BEGIN'.
 * constant.add('home', 'fetch-topic-list-begin');
 *
 * // Write the changes to disk. Otherwise only in memory, see more at rekitCore/vio
 * rekitCore.vio.flush();
 *
 * // Result => added a new line `const FETCH_TOPIC_LIST_BEGIN = 'FETCH_TOPIC_LIST_BEGIN';` to `home/redux/constants.js`.
**/
function add(feature, name) {
  name = _.upperSnakeCase(name);
  const targetPath = utils.mapReduxFile(feature, 'constants');
  const lines = vio.getLines(targetPath);
  const i = refactor.lastLineIndex(lines, /^export /);
  lines.splice(i + 1, 0, `export const ${name} = '${name}';`);
  vio.save(targetPath, lines);
}

/**
 * Rename a constant definition in a feature's `redux/constants.js` file, it forces UPPER_SNAKE_CASE.
 * @param {string} feature - The feature name.
 * @param {string} name - The component name.
 * @alias module:constant.rename
**/
function rename(feature, oldName, newName) {
  oldName = _.upperSnakeCase(oldName);
  newName = _.upperSnakeCase(newName);

  const targetPath = utils.mapReduxFile(feature, 'constants');
  const lines = vio.getLines(targetPath);
  const i = refactor.lineIndex(lines, `export const ${oldName} = '${oldName}';`);
  if (i >= 0) {
    lines[i] = `export const ${newName} = '${newName}';`;
  }

  vio.save(targetPath, lines);
}

/**
 * Remove a constant definition from a feature's `redux/constants.js` file, it forces UPPER_SNAKE_CASE.
 * @param {string} feature - The feature name.
 * @param {string} name - The component name.
 * @alias module:constant.remove
**/
function remove(feature, name) {
  name = _.upperSnakeCase(name);
  const targetPath = utils.mapReduxFile(feature, 'constants');
  refactor.removeLines(targetPath, `export const ${name} = '${name}';`);
}

module.exports = {
  add,
  remove,
  rename,
};
