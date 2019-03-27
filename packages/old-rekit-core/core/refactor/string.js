'use strict';

const _ = require('lodash');
const traverse = require('babel-traverse').default;
const common = require('./common');

function renameStringLiteral(ast, oldName, newName) {
  // Summary:
  //  Rename the string literal in ast
  // Return:
  //  All changes needed.

  const changes = [];
  traverse(ast, {
    StringLiteral(path) {
      // Simple replace literal strings
      if (path.node.value === oldName) {
        changes.push({
          start: path.node.start + 1,
          end: path.node.end - 1,
          replacement: newName,
        });
      }
    },
  });
  return changes;
}

function replaceStringLiteral(ast, oldName, newName, fullMatch) {
  // Summary:
  //  Replace the string literal in ast
  // Return:
  //  All changes needed.

  if (typeof fullMatch === 'undefined') fullMatch = true;

  const changes = [];
  traverse(ast, {
    StringLiteral(path) {
      // Simply replace literal strings
      if (fullMatch && path.node.value === oldName) {
        changes.push({
          start: path.node.start + 1,
          end: path.node.end - 1,
          replacement: newName,
        });
      } else if (!fullMatch && _.includes(path.node.value, oldName)) {
        const i = path.node.value.indexOf(oldName);
        const start = path.node.start + 1 + i;
        const end = start + oldName.length;
        changes.push({
          start,
          end,
          replacement: newName,
        });
      }
    },
  });
  return changes;
}

module.exports = {
  renameStringLiteral: common.acceptFilePathForAst(renameStringLiteral),
  replaceStringLiteral: common.acceptFilePathForAst(replaceStringLiteral),
};
