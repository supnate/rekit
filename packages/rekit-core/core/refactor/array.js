'use strict';

const _ = require('lodash');
const traverse = require('babel-traverse').default;
const utils = require('../utils');
const vio = require('../vio');
const common = require('./common');

/**
 * Find the nearest char index before given index. skip white space strings
 * If not found, return -1
 * eg: nearestCharBefore(',', '1,    2, 3', 4) => 1
 * @param {string} char - Which char to find
 * @param {string} str - The string to to search.
 * @index {number} index - From which index start to find
 * @
**/
function nearestCharBefore(char, str, index) {
  // Find the nearest char index before given index. skip white space strings
  // If not found, return -1
  // eg: nearestCharBefore(',', '1,    2, 3', 4) => 1
  let i = index - 1;
  while (i >= 0) {
    if (str.charAt(i) === char) return i;
    if (!/\s/.test(str.charAt(i))) return -1;
    i -= 1;
  }
  return -1;
}

/**
 * Similar with nearestCharBefore, but find the char after the given index.
 * If not found, return -1
 * @param {string} char - Which char to find
 * @param {string} str - The string to to search.
 * @index {number} index - From which index start to find
 * @
**/
function nearestCharAfter(char, str, index) {
  // Find the nearest char index before given index. skip white space strings
  // If not found, return -1
  let i = index + 1;
  while (i < str.length) {
    if (str.charAt(i) === char) return i;
    if (!/\s/.test(str.charAt(i))) return -1;
    i += 1;
  }
  return -1;
}

/**
 * Add an element to an array definition.
 * @param {object} node - The ast node of the array definition.
 * @param {string} code - The code to append to the array.
 * @alias module:refactor.addToArrayByNode
 * @
**/
function addToArrayByNode(node, code) {
  // node: the arr expression node
  // code: added as the last element of the array

  const multilines = node.loc.start.line !== node.loc.end.line;
  let insertPos = node.start + 1; // insert after '['

  if (node.elements.length) {
    const ele = _.last(node.elements);
    insertPos = ele.end;
  }

  let replacement;
  if (multilines) {
    const indent = _.repeat(' ', node.loc.end.column - 1);
    replacement = `\n${indent}  ${code}`;
    if (node.elements.length) {
      replacement = `,${replacement}`;
    } else {
      replacement = `${replacement},`;
    }
  } else {
    replacement = code;
    if (node.elements.length > 0) {
      replacement = `, ${code}`;
    }
  }
  return [{
    start: insertPos,
    end: insertPos,
    replacement,
  }];
}

/**
 * Remove an element from an array definition.
 * @param {object} node - The ast node of the array definition.
 * @param {object} eleNode - The ast node to be removed.
 * @alias module:refactor.removeFromArrayByNode
 * @
**/
function removeFromArrayByNode(node, eleNode) {
  const elements = node.elements;

  if (!elements.includes(eleNode)) {
    utils.warn('Failed to find element when trying to remove element from array.');
    return [];
  }

  if (!node._filePath) {
    utils.fatalError('No _filePath property found on node when removing element from array');
    return null;
  }

  const content = vio.getContent(node._filePath);
  let startPos = nearestCharBefore(',', content, eleNode.start);
  if (startPos < 0) {
    // it's the first element
    startPos = node.start + 1;
  }

  let endPos = eleNode.end;

  if (elements.length === 1) {
    // if the element is the only element, try to remove the trailing comma if exists
    const nextComma = nearestCharAfter(',', content, endPos - 1);
    if (nextComma >= 0) endPos = nextComma + 1;
  }

  return [{
    start: startPos,
    end: endPos,
    replacement: '',
  }];
}

/**
 * Add an identifier to the array of the name 'varName'.
 * It only finds the first matched array in the top scope of ast.
 *
 * @param {object|string} ast - The ast tree or the js file path to find the array.
 * @param {string} varName - The variable name of the array definition.
 * @param {string} identifierName - The identifier to append to array.
 * @alias module:refactor.addToArray
 *
 * @example
 * const refactor = require('rekit-core').refactor;
 * // code in ast: const arr = [a, b, c];
 * refactor.addToArray(file, 'arr', 'd');
 * // code changes to: const arr = [a, b, c, d];
**/
function addToArray(ast, varName, identifierName) {
  let changes = [];
  traverse(ast, {
    VariableDeclarator(path) {
      const node = path.node;
      if (_.get(node, 'id.name') !== varName || _.get(node, 'init.type') !== 'ArrayExpression') return;
      node.init._filePath = ast._filePath;
      changes = addToArrayByNode(node.init, identifierName);
      path.stop();
    }
  });
  return changes;
}

/**
 * Remove an identifier from the array of the name 'varName'.
 * It only finds the first matched array in the global scope of ast.
 *
 * @param {object|string} ast - The ast tree or the js file path to find the array.
 * @param {string} varName - The variable name of the array definition.
 * @param {string} identifierName - The identifier to append to array.
 * @alias module:refactor.removeFromArray
 *
 * @example
 * const refactor = require('rekit-core').refactor;
 * // code in ast: const arr = [a, b, c];
 * refactor.removeFromArray(file, 'arr', 'a');
 * // code changes to: const arr = [b, c];
**/
function removeFromArray(ast, varName, identifierName) {
  let changes = [];
  traverse(ast, {
    VariableDeclarator(path) {
      const node = path.node;
      if (_.get(node, 'id.name') !== varName || _.get(node, 'init.type') !== 'ArrayExpression') return;
      node.init._filePath = ast._filePath;
      const toRemove = _.find(node.init.elements, ele => ele.name === identifierName);
      changes = removeFromArrayByNode(node.init, toRemove);
      path.stop();
    }
  });
  return changes;
}

module.exports = {
  nearestCharBefore, // export only for test purpose
  nearestCharAfter, // export only for test purpose
  addToArrayByNode,
  removeFromArrayByNode,
  addToArray: common.acceptFilePathForAst(addToArray),
  removeFromArray: common.acceptFilePathForAst(removeFromArray),
};
