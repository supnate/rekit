'use strict';

const path = require('path');
const _ = require('lodash');
const utils = require('../utils');
const vio = require('../vio');

function updateSourceCode(code, changes) {
  // Summary:
  //  This must be called before code is changed some places else rather than ast

  changes.sort((c1, c2) => c2.start - c1.start);
  // Remove same or overlapped changes
  const newChanges = _.reduce(changes, (cleanChanges, curr) => {
    const last = _.last(cleanChanges);

    if (!cleanChanges.length || last.start > curr.end) {
      cleanChanges.push(curr);
    } else if (last.start === last.end && last.end === curr.start && curr.start === curr.end) {
      // insert code at the same position, merge them
      last.replacement += curr.replacement;
    }
    return cleanChanges;
  }, []);

  const chars = code.split('');
  newChanges.forEach((c) => {
    // Special case: after the change, two empty lines occurs, should delete one line
    if (c.replacement === '' && (c.start === 0 || chars[c.start - 1] === '\n') && chars[c.end] === '\n') {
      c.end += 1;
    }
    chars.splice(c.start, c.end - c.start, c.replacement);
  });
  return chars.join('');
}

function updateFile(filePath, changes) {
  // Summary:
  //  Update the source file by changes.

  if (_.isFunction(changes)) {
    const ast = vio.getAst(filePath);
    vio.assertAst(ast, filePath);
    changes = changes(ast);
  }
  let code = vio.getContent(filePath);
  code = updateSourceCode(code, changes);
  vio.save(filePath, code);
}

// find module alias
function getModuleResolverAlias() {
  const thePkgJson = utils.getPkgJson();
  const babelPlugins = _.get(thePkgJson, 'babel.plugins');
  let alias = {};
  if (_.isArray(babelPlugins)) {
    const moduleResolver = babelPlugins.filter(p => p[0] === 'module-resolver');
    if (moduleResolver.length) {
      alias = moduleResolver[0][1].alias;
    }
  }
  return alias;
}

/**
 * Check if a module is local module. It will check alias defined by babel plugin module-resolver.
 * @param {string} modulePath - The module path. i.e.: import * from './abc'; './abc' is the module path.
 * @alias module:common.isLocalModule
**/
function isLocalModule(modulePath) {
  // TODO: handle alias module path like src
  const alias = getModuleResolverAlias();
  return /^\./.test(modulePath) || _.keys(alias).some(a => _.startsWith(modulePath, a));
}

/**
 * Resolve the module path.
 * @param {string} relativeTo - Relative to which file to resolve. That is the file in which import the module.
 * @param {string} modulePath - The relative module path.
 * @alias module:common.resolveModulePath
**/
function resolveModulePath(relativeToFile, modulePath) {
  if (!isLocalModule(modulePath)) {
    return modulePath;
  }

  const alias = getModuleResolverAlias();
  const matched = _.find(_.keys(alias), k => _.startsWith(modulePath, k));

  let res = null;
  if (matched) {
    const resolveTo = alias[matched];

    const relativePath = modulePath.replace(matched, '').replace(/^\//, '');
    res = utils.joinPath(utils.getProjectRoot(), resolveTo, relativePath);
  } else {
    res = utils.joinPath(path.dirname(relativeToFile), modulePath);
  }

  if (/src\/features\/[^/]+\/?$/.test(res)) {
    // if import from a feature folder, then resolve to index.js
    res = res.replace(/\/$/, '') + '/index';
  }

  return res;
}

function isSameModuleSource(s1, s2, contextFilePath) {
  return resolveModulePath(contextFilePath, s1) === resolveModulePath(contextFilePath, s2);
}


function acceptFilePathForAst(func) {
  // Summary:
  //  Wrapper a function that accepts ast also accepts file path.
  //  If it's file path, then update the file immediately.

  return function(file) { // eslint-disable-line
    let ast = file;
    if (_.isString(file)) {
      ast = vio.getAst(file);
      vio.assertAst(ast, file);
    }
    const args = _.toArray(arguments);
    args[0] = ast;

    const changes = func.apply(null, args);

    if (_.isString(file)) {
      updateFile(file, changes);
    }

    return changes;
  };
}

function acceptFilePathForLines(func) {
  // Summary:
  //  Wrapper a function that accepts lines also accepts file path.
  //  If it's file path, then update the file immediately.

  return function(file) { // eslint-disable-line
    let lines = file;
    if (_.isString(file)) {
      lines = vio.getLines(file);
    }
    const args = _.toArray(arguments);
    args[0] = lines;
    func.apply(null, args);

    if (_.isString(file)) {
      vio.save(file, lines);
    }
  };
}

module.exports = {
  updateSourceCode,
  updateFile,
  isLocalModule,
  isSameModuleSource,
  resolveModulePath,
  acceptFilePathForAst,
  acceptFilePathForLines,
};
