const _ = require('lodash');
const traverse = require('babel-traverse').default;
const t = require('babel-types');
const vio = require('./vio');
const ast = require('./ast');
const paths = require('./paths');
const refactor = require('./refactor');

const depsCache = {};

function getDeps(filePath, originalFilePath) {
  // Summary:
  //   Get dependencies of a module
  // originalFilePath is used to avoid circle loop
  if (originalFilePath === filePath) return [];

  if (depsCache[filePath] && depsCache[filePath].content === vio.getContent(filePath)) {
    return depsCache[filePath].deps;
  }

  const deps = [];

  const pushModuleSource = (moduleSource, args = {}) => {
    if (!moduleSource) return;
    if (!refactor.isLocalModule(moduleSource)) {
      deps.push({
        id: moduleSource,
        type: 'npm',
      });
      return;
    }
    let modulePath = refactor.resolveModulePath(filePath, moduleSource);
    // maybe modulePath is json/img or others.
    if (!vio.fileExists(modulePath)) modulePath += '.js';
    deps.push({ id: modulePath, type: 'file', ...args });
  };
  traverse(ast.getAst(filePath), {
    ExportNamedDeclaration(path) {
      const moduleSource = _.get(path, 'node.source.value');
      const exported = _.get(path, 'node.specifiers').map(specifier => _.get(specifier, 'exported.name'));
      pushModuleSource(moduleSource, { exported });
    },
    ExportAllDeclaration(path) {
      const moduleSource = _.get(path, 'node.source.value');
      pushModuleSource(moduleSource);
    },
    CallExpression(path) {
      if (
        (_.get(path, 'node.callee.name') === 'require' || _.get(path, 'node.callee.type') === 'Import') &&
        t.isStringLiteral(_.get(path, 'node.arguments[0]'))
      ) {
        const moduleSource = _.get(path, 'node.arguments[0].value');
        pushModuleSource(moduleSource);
      }
    },
    ImportDeclaration(path) {
      const moduleSource = _.get(path, 'node.source.value');
      const imported = [];
      let defaultImport = false;
      path.node.specifiers.forEach(specifier => {
        if (specifier.type === 'ImportNamespaceSpecifier') {
          // imported.push('*');
          // TODO: try to analyze namespace import
        }
        if (specifier.type === 'ImportSpecifier') {
          imported.push(specifier.imported.name);
        }
        if (specifier.type === 'ImportDefaultSpecifier') {
          defaultImport = true;
        }
      });

      pushModuleSource(moduleSource, {
        imported,
        defaultImport,
      });
    },
  });

  // Flatten deps
  // If a module use 'export ... from ...' then should direct to the real target module.

  return deps;
}

module.exports = {
  getDeps,
};
