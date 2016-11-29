'use strict';

// Summary:
//  Rename variables in a Rekit element

const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const shell = require('shelljs');
// const vio = require('./vio');

function getDefNode(name, scope) {
  // Summary:
  //  Get the definition node for an identifier

  while (scope) {
    if (scope.bindings[name]) return scope.bindings[name].identifier;
    scope = scope.parent;
  }
  return null;
}


function renameIdentifier(ast, oldName, newName, defNode) {
  // Summary:
  //  Rename identifiers with oldName in ast

  function rename(path) {
    if (path.node.name === oldName && getDefNode(path.node.name, path.scope) === defNode) {
      path.node.name = newName;
    }
  }
  traverse(ast, {
    JSXIdentifier: rename,
    Identifier: rename,
  });
}

function renameClassName(ast, oldName, newName) {
  // Summary:
  //  Rename the class name in a module
  // Return:
  //  true for success, false for not found.

  let defNode = null;
  // Find the definition node of the class
  traverse(ast, {
    ClassDeclaration(path) {
      if (path.node.id.name === oldName) {
        defNode = path.node.id;
      }
    },
  });

  if (defNode) {
    renameIdentifier(ast, oldName, newName, defNode);
    return true;
  }
  return false;
}

function renameImportVariable(ast, oldName, newName) {
  // Summary:
  //  Rename the import(default, named) variable name and their reference.
  //  The simple example is to rename a component
}

function renamePropsMember(ast, oldName, newName) {

}

function renameFunctionName(ast, oldName, newName) {

}

function renameConstant(ast, oldName, newName) {
  
}

function renameCssClassName(ast, oldName, newName) {

}

module.exports = {
  renameClassName,
};
