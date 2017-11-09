'use strict';

const _ = require('lodash');
const traverse = require('babel-traverse').default;
const common = require('./common');
const utils = require('../utils');

function objExpToObj(objExp) {
  // only for non-computed properties
  const obj = {};
  objExp.properties.forEach((p) => {
    if (p.computed) return;
    obj[p.key.name] = p;
  });
  return obj;
}

function addObjectProperty(ast, varName, propName, propValue) {
  const changes = [];
  traverse(ast, {
    VariableDeclarator(path) {
      const node = path.node;
      if ((varName && _.get(node, 'id.name') !== varName) || _.get(node, 'init.type') !== 'ObjectExpression') return;
      const props = _.get(node, 'init.properties');

      const multilines = node.loc.start.line !== node.loc.end.line;
      // Check if it exists
      const targetPropNode = _.find(props, p =>
        _.get(p, 'key.type') === 'Identifier'
        && _.get(p, 'key.name') === propName
        && !p.computed);

      if (!targetPropNode) {
        const targetPos = node.end - 1;
        if (multilines) {
          const indent = _.repeat(' ', node.loc.end.column - 1);
          changes.push({
            start: targetPos,
            end: targetPos,
            replacement: `${indent}  ${propName}: ${propValue},\n`,
          });
        } else {
          changes.push({
            start: targetPos,
            end: targetPos,
            replacement: `${props.length ? ', ' : ' '}${propName}: ${propValue} `,
          });
        }
      } else {
        utils.warn(`Property name '${propName}' already exists for ${varName}.`);
      }
    },
  });
  return changes;
}

function setObjectProperty(ast, varName, propName, propValue) {
  const changes = [];
  traverse(ast, {
    VariableDeclarator(path) {
      const node = path.node;
      if ((varName && _.get(node, 'id.name') !== varName) || _.get(node, 'init.type') !== 'ObjectExpression') return;
      const props = _.get(node, 'init.properties');

      // Check if it exists
      const targetPropNode = _.find(props, p =>
        _.get(p, 'key.type') === 'Identifier'
        && _.get(p, 'key.name') === propName
        && !p.computed);

      if (targetPropNode) {
        changes.push({
          start: targetPropNode.value.start,
          end: targetPropNode.value.end,
          replacement: propValue,
        });
      }
    },
  });
  return changes;
}

function renameObjectProperty(ast, varName, oldName, newName) {
  // Summary:
  //  Rename the object property and only for non-computed identifier property
  // Return:
  //  All changes needed.

  const changes = [];
  traverse(ast, {
    VariableDeclarator(path) {
      const node = path.node;
      if ((varName && _.get(node, 'id.name') !== varName) || _.get(node, 'init.type') !== 'ObjectExpression') return;
      const props = _.get(node, 'init.properties');

      // const multilines = node.loc.start.line !== node.loc.end.line;
      const targetPropNode = _.find(props, p =>
        _.get(p, 'key.type') === 'Identifier'
        && _.get(p, 'key.name') === oldName
        && !p.computed);

      if (targetPropNode) {
        changes.push({
          start: targetPropNode.key.start,
          end: targetPropNode.key.end,
          replacement: newName,
        });
      }
    },
  });
  return changes;
}

function removeObjectProperty(ast, varName, propName) {
  const changes = [];
  traverse(ast, {
    VariableDeclarator(path) {
      const node = path.node;
      if ((varName && _.get(node, 'id.name') !== varName) || _.get(node, 'init.type') !== 'ObjectExpression') return;
      const props = _.get(node, 'init.properties');

      const multilines = node.loc.start.line !== node.loc.end.line;

      const targetPropNode = _.find(props, p =>
        _.get(p, 'key.type') === 'Identifier'
        && _.get(p, 'key.name') === propName
        && !p.computed);

      if (targetPropNode) {
        const targetIndex = _.indexOf(props, targetPropNode);
        let startIndex;
        let endIndex;
        if (targetIndex > 0) {
          startIndex = props[targetIndex - 1].end;
          endIndex = targetPropNode.end;
        } else {
          startIndex = node.init.start + 1;
          endIndex = targetPropNode.end + (multilines || targetIndex < props.length - 1 ? 1 : 0);
        }
        changes.push({
          start: startIndex,
          end: endIndex,
          replacement: '',
        });
      }
    },
  });
  return changes;
}

module.exports = {
  objExpToObj,
  addObjectProperty: common.acceptFilePathForAst(addObjectProperty),
  setObjectProperty: common.acceptFilePathForAst(setObjectProperty),
  renameObjectProperty: common.acceptFilePathForAst(renameObjectProperty),
  removeObjectProperty: common.acceptFilePathForAst(removeObjectProperty),
};
