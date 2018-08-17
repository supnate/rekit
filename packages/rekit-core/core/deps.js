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
      const exported = _.get(path, 'node.specifiers').reduce((prev, specifier) => {
        prev[_.get(specifier, 'exported.name')] = _.get(specifier, 'local.name');
        return prev;
      }, {});
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
  const realDeps = deps.reduce((prev, dep) => {
    if (dep.imported && dep.imported.length) {
      const depsOfDep = getDeps(dep.id, originalFilePath || filePath);
      const imported = [...dep.imported];
      dep.imported.forEach(importedName => {
        depsOfDep.forEach(theDep => {
          if (theDep.exported && theDep.exported[importedName]) {
            _.pull(imported, importedName);
            const dep2 = { id: theDep.id, type: theDep.type };
            const realImported = theDep.exported[importedName];
            if (realImported === 'default') dep2.defaultImport = true;
            else {
              dep2.imported = [realImported];
              dep2.defaultImport = false;
            }
            prev.push(dep2);
          }
        });
      });
      if (imported.length) {
        prev.push({
          ...dep,
          imported,
        });
      } else if (dep.defaultImport) {
        const dep2 = { ...dep };
        delete dep2.imported;
        prev.push(dep2);
      }
    } else prev.push(dep);
    return prev;
  }, []);

  // Merge deps
  const byId = {};
  realDeps.forEach(dep => {
    let dep2 = byId[dep.id];
    if (!dep2) {
      byId[dep.id] = dep;
      dep2 = dep;
    } else {
      const merged = {
        id: dep.id,
        defaultImport: dep.defaultImport || dep2.defaultImport,
        imported: _.uniq([...(dep2.imported || []), ...(dep.imported || [])]),
        exported: { ...dep.exported, ...dep2.exported },
        isImport: dep.isImport || dep2.isImport,
        isRequire: dep.isRequire || dep2.isRequire,
        type: dep.type,
      };
      if (!merged.imported.length) delete merged.imported;
      if (!merged.isImport) delete merged.isImport;
      if (!merged.isRequire) delete merged.isRequire;
      if (!Object.keys(merged.exported).length) delete merged.exported;

      byId[dep.id] = merged;
    }
  });

  return Object.values(byId);
}

module.exports = {
  getDeps,
};
