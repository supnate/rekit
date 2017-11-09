'use strict';

const traverse = require('babel-traverse').default;
const common = require('./common');
const identifier = require('./identifier');

/**
 * Rename a es6 class name in a module. Only rename the class definition and its reference in the module.
 * It will not find other files to rename reference.
 * @param {string} ast - Which module to rename class name.
 * @param {string} oldName - The old class name.
 * @index {number} newName - The new class name.
 * @alias module:refactor.renameClassName
 * @example
 * // class MyClass {
 * //   ...
 * // }
 * const refactor = require('rekit-core').refactor;
 * refactor.renameClassName(file, 'MyClass', 'NewMyClass');
 * // => class NewMyClass {
 * // =>   ...
 * // => }
**/
function renameClassName(ast, oldName, newName) {
  let defNode = null;
  // Find the definition node of the class
  traverse(ast, {
    ClassDeclaration(path) {
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
  renameClassName: common.acceptFilePathForAst(renameClassName),
};
