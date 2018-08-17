const _ = require('lodash');
const traverse = require('babel-traverse').default;
const t = require('babel-types');
const vio = require('./vio');
const ast = require('./ast');
const refactor = require('./refactor');

const depsCache = {};

function getDeps(filePath, originalFilePath) {
  // Summary:
  //   Get dependencies of a module
  //   originalFilePath is used to avoid circle loop

  if (originalFilePath === filePath) return [];

  if (depsCache[filePath] && depsCache[filePath].content === vio.getContent(filePath)) {
    return depsCache[filePath].deps;
  }

  if (!vio.fileExists(filePath)) return [];

  const deps = [];

  const pushModuleSource = (moduleSource, args = {}) => {
    if (!moduleSource) return;
    if (!refactor.isLocalModule(moduleSource)) {
      deps.push({
        id: moduleSource,
        type: 'npm',
        ...args,
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
      const isRequire = _.get(path, 'node.callee.name') === 'require';
      const isImport = _.get(path, 'node.callee.type') === 'Import';
      if ((isRequire || isImport) && t.isStringLiteral(_.get(path, 'node.arguments[0]'))) {
        const moduleSource = _.get(path, 'node.arguments[0].value');
        const args = {};
        if (isRequire) args.isRequire = true;
        if (isImport) args.isImport = true;
        pushModuleSource(moduleSource, args);
      }
    },
    ImportDeclaration(path) {
      const moduleSource = _.get(path, 'node.source.value');
      const imported = [];
      let defaultImport = false;
      let nsImport = false;
      path.node.specifiers.forEach(specifier => {
        if (specifier.type === 'ImportNamespaceSpecifier') {
          // imported.push('*');
          // TODO: try to analyze namespace import
          nsImport = true;
        }
        if (specifier.type === 'ImportSpecifier') {
          imported.push(specifier.imported.name);
        }
        if (specifier.type === 'ImportDefaultSpecifier') {
          defaultImport = true;
        }
      });

      const args = {};
      if (imported.length) args.imported = imported;
      if (nsImport) args.nsImport = true;
      args.defaultImport = defaultImport;
      pushModuleSource(moduleSource, args);
    },
  });

  // Flatten deps
  // If a module use 'export ... from ...' then should direct to the real target module.
  // e.g.
  // currentModule: import { a, b } from './someModule';
  // someModule: export { default as a, b } from './anotherModule';
  // then: currentModule depends on anotherrModule
  return deps.reduce((prev, dep) => {
    if (dep.imported && dep.imported.length) {
      const depsOfDep = getDeps(dep.id, originalFilePath || filePath);
      const imported = [...dep.imported];
      dep.imported.forEach(importedName => {
        depsOfDep.forEach(theDep => {
          if (theDep.exported && theDep.exported.includes(importedName)) {
            _.pull(imported, importedName);
            let dep2 = _.find(prev, { id: theDep.id });
            if (!dep2) dep2 = { id: theDep.id, type: theDep.type };
            if (!dep2.imported) dep2.imported = [];
            dep2.imported.push(importedName);
            prev.push(dep2);
          }
        });
      });
      if (imported.length) {
        prev.push({
          ...dep,
          imported,
        });
      }
    } else prev.push(dep);
    return prev;
  }, []);
}

module.exports = {
  getDeps,
};
