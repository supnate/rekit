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

// function nearestCharBefore(char, str, index) {
//   // Find the nearest char index before given index. skip white space strings
//   // If not found, return -1
//   // eg: nearestCharBefore(',', '1,    2, 3', 4) => 1
//   let i = index - 1;
//   while (i >= 0) {
//     if (str.charAt(i) === char) return i;
//     if (!/\s/.test(str.charAt(i))) return -1;
//     i -= 1;
//   }
//   return -1;
// }

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

      let insertPos = node.init.start + 1;
      if (props.length) {
        insertPos = _.last(props).end;
      }
      const code = `${propName}: ${propValue}`;
      if (!targetPropNode) {
        let replacement;
        const targetPos = node.end - 1;
        if (multilines) {
          const indent = _.repeat(' ', node.loc.end.column - 1);
          replacement = `\n${indent}  ${code}`;
          if (props.length) {
            replacement = `,${replacement}`;
          } else {
            replacement = `${replacement},`;
          }
        } else {
          replacement = ` ${code} `;
          if (props.length > 0) {
            replacement = `, ${code}`;
          }
        }
        changes.push({
          start: insertPos,
          end: insertPos,
          replacement,
        });
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
