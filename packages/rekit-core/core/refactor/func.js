'use strict';

const traverse = require('babel-traverse').default;
const common = require('./common');
const identifier = require('./identifier');

/**
 * Rename a function name in a module.
 * @param {string} ast - Which module to rename function.
 * @param {string} oldName - The old function name.
 * @index {number} newName - The new function name.
 * @alias module:refactor.renameFunctionName
 * @example
 * // function MyFunc() {
 * //   ...
 * // }
 * const refactor = require('rekit-core').refactor;
 * refactor.renameFunctionName(file, 'MyFunc', 'NewMyFunc');
 * // => function NewMyFunc {
 * // =>   ...
 * // => }
**/
function renameFunctionName(ast, oldName, newName) {
  // Summary:
  //  Rename the name of the function first found. Usually used by
  //  flat function definition file.

  let defNode = null;
  // Find the definition node of the class
  traverse(ast, {
    FunctionDeclaration(path) {
      if (path.node.id && path.node.id.name === oldName) {
        defNode = path.node.id;
      }
    },
  });

  if (defNode) {
    return identifier.renameIdentifier(ast, oldName, newName, defNode);
  }
  return [];
}

module.exports = {
  renameFunctionName: common.acceptFilePathForAst(renameFunctionName),
};
