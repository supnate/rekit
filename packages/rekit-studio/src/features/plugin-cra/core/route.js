'use strict';

const _ = require('lodash');
const traverse = require('babel-traverse').default;
const utils = require('./utils');

const { ast, refactor, vio } = rekit.core;

function getChildRoutesNode(ast1) {
  let arrNode = null;
  traverse(ast1, {
    ObjectProperty(path) {
      const node = path.node;
      if (_.get(node, 'key.name') === 'childRoutes' && _.get(node, 'value.type') === 'ArrayExpression') {
        arrNode = node.value;
        arrNode._filePath = ast1._filePath;
        path.stop();
      }
    },
  });
  return arrNode;
}
// Add component to a route.js under a feature.
// It imports all component from index.js
function add(elePath, args) {
  const ele = utils.parseElePath(elePath, 'component');
  const routePath = `src/features/${ele.feature}/route.js`;
  if (!vio.fileExists(routePath)) {
    throw new Error(`route.add failed: file not found ${routePath}`);
  }

  const { urlPath } = args;
  refactor.addImportFrom(routePath, './', '', ele.name);

  const ast1 = ast.getAst(routePath, true);
  const arrNode = getChildRoutesNode(ast1);
  if (arrNode) {
    const rule = `{ path: '${urlPath}', component: ${ele.name}${args.isIndex ? ', isIndex: true' : ''} }`;
    const changes = refactor.addToArrayByNode(arrNode, rule);
    const code = refactor.updateSourceCode(vio.getContent(routePath), changes);
    vio.save(routePath, code);
  } else {
    throw new Error(
      `You are adding a route rule, but can't find childRoutes property in '${routePath}', please check.`
    );
  }
}

function remove(elePath) {
  const ele = utils.parseElePath(elePath, 'component');
  const routePath = `src/features/${ele.feature}/route.js`;
  if (!vio.fileExists(routePath)) {
    throw new Error(`route.add failed: file not found ${routePath}`);
  }

  refactor.removeImportSpecifier(routePath, ele.name);

  const ast1 = ast.getAst(routePath, true);
  const arrNode = getChildRoutesNode(ast1);
  if (arrNode) {
    let changes = [];
    arrNode.elements
      .filter(element =>
        _.find(
          element.properties,
          p => _.get(p, 'key.name') === 'component' && _.get(p, 'value.name') === ele.name
        )
      )
      .forEach(element => {
        changes = changes.concat(refactor.removeFromArrayByNode(arrNode, element));
      });
    const code = refactor.updateSourceCode(vio.getContent(routePath), changes);
    vio.save(routePath, code);
  } else {
    utils.fatal(
      `You are removing a route rule, but can't find childRoutes property in '${routePath}', please check.`
    );
  }
}

function move(source, target) {
  const targetPath = utils.mapFeatureFile(source.feature, 'route.js');
  const targetPath2 = utils.mapFeatureFile(target.feature, 'route.js');
  const oldName = _.pascalCase(source.name);
  const newName = _.pascalCase(target.name);
  if (source.feature === target.feature) {
    // If in the same feature, rename imported component name
    refactor.updateFile(targetPath, ast =>
      [].concat(
        refactor.renameImportSpecifier(ast, oldName, newName),
        refactor.renameStringLiteral(ast, _.kebabCase(oldName), _.kebabCase(newName)), // Rename path
        refactor.renameStringLiteral(ast, _.upperFirst(_.lowerCase(oldName)), _.upperFirst(_.lowerCase(newName))) // Rename name
      )
    );
  } else {
    const ast = vio.getAst(targetPath);
    vio.assertAst(ast, targetPath);
    const ruleNodes = [];
    traverse(ast, {
      ObjectExpression(path) {
        const node = path.node;
        const obj = refactor.objExpToObj(node);
        if (path.inList && path.listKey === 'elements' && obj.path && _.get(obj, 'component.value.name') === oldName) {
          // it's in array and component is oldName
          ruleNodes.push(node);
        }
      },
    });

    const oldContent = vio.getContent(targetPath);
    ruleNodes.forEach(ruleNode => {
      const ast2 = vio.getAst(targetPath2);
      vio.assertAst(ast2, targetPath2);
      const arrNode = getChildRoutesNode(ast2);

      // move route rule to the target route.js
      refactor.updateFile(targetPath2, astArg =>
        [].concat(
          refactor.addImportFrom(astArg, './', '', newName),
          refactor.addToArrayByNode(
            arrNode,
            oldContent.substring(ruleNode.start, ruleNode.end).replace(`component: ${oldName}`, `component: ${newName}`)
          )
        )
      );

      // rename string literals if needed
      refactor.updateFile(targetPath2, astArg =>
        [].concat(
          refactor.renameStringLiteral(astArg, _.kebabCase(oldName), _.kebabCase(newName)), // Rename path
          refactor.renameStringLiteral(astArg, _.upperFirst(_.lowerCase(oldName)), _.upperFirst(_.lowerCase(newName))) // Rename name
        )
      );
    });

    remove(source.feature, source.name);
  }
}

module.exports = {
  add,
  remove,
  move,
};
