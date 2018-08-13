'use strict';

const _ = require('lodash');
const traverse = require('babel-traverse').default;
const { refactor, vio } = rekit.core;
// const refactor = require('./refactor');
// const utils = require('./utils');
// const vio = require('./vio');
// const assert = require('./assert');

function getChildRoutesNode(ast) {
  let arrNode = null;
  traverse(ast, {
    ObjectProperty(path) {
      const node = path.node;
      if (_.get(node, 'key.name') === 'childRoutes' && _.get(node, 'value.type') === 'ArrayExpression') {
        arrNode = node.value;
        arrNode._filePath = ast._filePath;
        path.stop();
      }
    }
  });
  return arrNode;
}

function add(feature, component, args) {
  assert.notEmpty(feature, 'feature');
  assert.notEmpty(component, 'component name');
  assert.featureExist(feature);
  args = args || {};
  const urlPath = args.urlPath || _.kebabCase(component);
  const targetPath = utils.mapFeatureFile(feature, 'route.js');
  refactor.addImportFrom(targetPath, './', '', _.pascalCase(component));

  const ast = vio.getAst(targetPath);
  vio.assertAst(ast, targetPath);
  const arrNode = getChildRoutesNode(ast);
  if (arrNode) {
    const rule = `{ path: '${urlPath}', name: '${args.pageName || _.upperFirst(_.lowerCase(component))}', component: ${_.pascalCase(component)}${args.isIndex ? ', isIndex: true' : ''} }`;
    const changes = refactor.addToArrayByNode(arrNode, rule);
    const code = refactor.updateSourceCode(vio.getContent(targetPath), changes);
    vio.save(targetPath, code);
  } else {
    utils.fatal(`You are adding a route rule, but can't find childRoutes property in 'src/features/${feature}/route.js', please check.`);
  }
}

function remove(feature, component) {
  assert.notEmpty(feature, 'feature');
  assert.notEmpty(component, 'component name');
  assert.featureExist(feature);

  const targetPath = utils.mapFeatureFile(feature, 'route.js');
  refactor.removeImportSpecifier(targetPath, _.pascalCase(component));
  const ast = vio.getAst(targetPath);
  vio.assertAst(ast, targetPath);
  const arrNode = getChildRoutesNode(ast);
  if (arrNode) {
    let changes = [];
    arrNode.elements
      .filter(ele => _.find(ele.properties, p => _.get(p, 'key.name') === 'component' && _.get(p, 'value.name') === _.pascalCase(component)))
      .forEach((ele) => { changes = changes.concat(refactor.removeFromArrayByNode(arrNode, ele)); });
    const code = refactor.updateSourceCode(vio.getContent(targetPath), changes);
    vio.save(targetPath, code);
  } else {
    utils.fatal(`You are removing a route rule, but can't find childRoutes property in 'src/features/${feature}/route.js', please check.`);
  }
}

function move(source, target) {
  const targetPath = utils.mapFeatureFile(source.feature, 'route.js');
  const targetPath2 = utils.mapFeatureFile(target.feature, 'route.js');
  const oldName = _.pascalCase(source.name);
  const newName = _.pascalCase(target.name);
  if (source.feature === target.feature) {
    // If in the same feature, rename imported component name
    refactor.updateFile(targetPath, ast => [].concat(
      refactor.renameImportSpecifier(ast, oldName, newName),
      refactor.renameStringLiteral(ast, _.kebabCase(oldName), _.kebabCase(newName)), // Rename path
      refactor.renameStringLiteral(ast, _.upperFirst(_.lowerCase(oldName)), _.upperFirst(_.lowerCase(newName))) // Rename name
    ));
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
      }
    });

    const oldContent = vio.getContent(targetPath);
    ruleNodes.forEach((ruleNode) => {
      const ast2 = vio.getAst(targetPath2);
      vio.assertAst(ast2, targetPath2);
      const arrNode = getChildRoutesNode(ast2);

      // move route rule to the target route.js
      refactor.updateFile(targetPath2, astArg => [].concat(
        refactor.addImportFrom(astArg, './', '', newName),
        refactor.addToArrayByNode(arrNode, oldContent.substring(ruleNode.start, ruleNode.end).replace(`component: ${oldName}`, `component: ${newName}`))
      ));

      // rename string literals if needed
      refactor.updateFile(targetPath2, astArg => [].concat(
        refactor.renameStringLiteral(astArg, _.kebabCase(oldName), _.kebabCase(newName)), // Rename path
        refactor.renameStringLiteral(astArg, _.upperFirst(_.lowerCase(oldName)), _.upperFirst(_.lowerCase(newName))) // Rename name
      ));
    });

    remove(source.feature, source.name);
  }
}

module.exports = {
  add,
  remove,
  move,
};
