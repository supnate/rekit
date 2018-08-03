'use strict';

const traverse = require('babel-traverse').default;
const common = require('./common');

function getDefNode(name, scope) {
  // Summary:
  //  Get the definition node for an identifier

  while (scope) {
    if (scope.bindings[name]) return scope.bindings[name].identifier;
    scope = scope.parent;
  }
  return null;
}

/**
 * Rename an top scope identifier in a module. If first finds the definition node of the given name.
 * Then rename all identifiers those refer to that definition node.
 * @param {string} ast - Which module to rename an identifier.
 * @param {string} oldName - The old identifier name.
 * @index {string} newName - The new identifier name.
 * @index {object} defNode - The definition node of the identifier. If not provided, then find the first definition in the module.
 * @alias module:refactor.renameIdentifier
 * @example
 * // import { m1 } from './some-module';
 * // m1.doSomething();
 * // function () { const m1 = 'abc'; }
 * const refactor = require('rekit-core').refactor;
 * refactor.renameIdentifier(file, 'm1', 'm2');
 * // => import { m2 } from './some-module';
 * // => m2.doSomething();
 * // => function () { const m1 = 'abc'; } // m1 is not renamed.
**/
function renameIdentifier(ast, oldName, newName, defNode) {
  // Summary:
  //  Rename identifiers with oldName in ast
  const changes = [];
  if (!defNode) {
    let scope;
    traverse(ast, {
      Identifier(path) {
        if (path.node.name === oldName) {
          scope = path.scope;
          path.stop();
        }
      }
    });
    if (!scope) return;
    defNode = getDefNode(oldName, scope);
  }

  function rename(path) {
    if (
      path.node.name === oldName
      && path.key !== 'imported'// it should NOT be imported specifier
      && getDefNode(path.node.name, path.scope) === defNode) {
      path.node.name = newName;
      changes.push({
        start: path.node.start,
        end: path.node.end,
        replacement: newName,
      });
    }
  }
  traverse(ast, {
    JSXIdentifier: rename,
    Identifier: rename,
  });
  return changes;
}

module.exports = {
  renameIdentifier: common.acceptFilePathForAst(renameIdentifier),
};
