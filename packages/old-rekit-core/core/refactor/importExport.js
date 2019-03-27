'use strict';

const _ = require('lodash');
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const babelTypes = require('babel-types');
const common = require('./common');
const identifier = require('./identifier');

// NOTE: comments set to false to avoid leadingComments and tailingComments be output.
// So that comments will not be duplicated.
// This prevents inline comment inside the import statement like:
//   import { /* my comment */ ModuleA } from 'modules';
// The inline comment /* my comment */ will be removed after import/export change.

const babelGeneratorOptions = {
  quotes: 'single',
  comments: false,
};

function formatMultilineImport(importCode) {
  // format import statement to:
  // import {
  //   name1,
  //   name2,
  // } from './xxx';

  const m = importCode.match(/\{([^}]+)\}/);
  if (m) {
    const arr = _.compact(m[1].split(/, */).map(_.trim));
    if (arr.length) {
      return importCode.replace(/\{[^}]+\}/, `{\n  ${arr.join(',\n  ')},\n}`);
    }
  }
  return importCode;
}

/**
 * Import from a given module source. This methods operates import statement:
 * import defaultImmport, { namedImport ... } from './module-source';
 * It noly supports es6 modules import but not commonJS or AMD or others...
 * @param {string} ast - Which module to manage import statement.
 * @param {string} moduleSource - From which module source to add import from. If not found, the create an import line.
 * @index {string} defaultImport - The default import. If not need, pass it as null. The module should haven't import the default.
 * @index {string|array} namedImport - The named imports. If has imported, then do nothing.
 * @index {string} namespaceImport - The new function name.
 * @alias module:refactor.addImportFrom
 * @example
 * const refactor = require('rekit-core').refactor;
 * refactor.addImportFrom(file, './some-module', 'SomeModule', ['method1', 'method2']);
 * // it generates: import SomeModule, { method1, method2 } from './some-module';
 **/
function addImportFrom(ast, moduleSource, defaultImport, namedImport, namespaceImport) {
  // Summary:
  //  Add import from source module. Such as import { xxx } from './x';
  let names = [];

  if (namedImport) {
    if (typeof namedImport === 'string') {
      names.push(namedImport);
    } else {
      names = names.concat(namedImport);
    }
  }

  const changes = [];
  const t = babelTypes;

  let targetImportPos = 0;
  let sourceExisted = false;
  traverse(ast, {
    ImportDeclaration(path) {
      const node = path.node;
      // multilines means whether to separate import specifiers into different lines
      const multilines = node.loc.start.line !== node.loc.end.line;
      targetImportPos = path.node.end + 1;

      if (!node.specifiers || !node.source || node.source.value !== moduleSource) return;
      sourceExisted = true;
      let newNames = [];
      const alreadyHaveDefaultImport = !!_.find(node.specifiers, { type: 'ImportDefaultSpecifier' });
      const alreadyHaveNamespaceImport = !!_.find(node.specifiers, { type: 'ImportNamespaceSpecifier' });
      if (defaultImport && !alreadyHaveDefaultImport) newNames.push(defaultImport);
      if (namespaceImport && !alreadyHaveNamespaceImport) newNames.push(namespaceImport);

      newNames = newNames.concat(names);

      // only add names which don't exist
      newNames = newNames.filter(n => !_.find(node.specifiers, s => s.local.name === n));

      if (newNames.length > 0) {
        const newSpecifiers = [].concat(node.specifiers);
        newNames.forEach(n => {
          const local = t.identifier(n);
          const imported = local; // TODO: doesn't support local alias.
          if (n === defaultImport) {
            newSpecifiers.unshift(t.importDefaultSpecifier(local));
          } else if (n === namespaceImport) {
            newSpecifiers.push(t.importNamespaceSpecifier(local));
          } else {
            newSpecifiers.push(t.importSpecifier(local, imported));
          }
        });

        const newNode = Object.assign({}, node, { specifiers: newSpecifiers });
        let newCode = generate(newNode, babelGeneratorOptions).code;

        if (multilines) {
          newCode = formatMultilineImport(newCode);
        }
        changes.push({
          start: node.start,
          end: node.end,
          replacement: newCode,
        });
      }
    },
  });

  if (changes.length === 0 && !sourceExisted) {
    // add new import declaration if module source doesn't exist
    const specifiers = [];
    if (defaultImport) {
      specifiers.push(t.importDefaultSpecifier(t.identifier(defaultImport)));
    }
    if (namespaceImport) {
      specifiers.push(t.importNamespaceSpecifier(t.identifier(namespaceImport)));
    }

    names.forEach(n => {
      const local = t.identifier(n);
      const imported = local;
      specifiers.push(t.importSpecifier(local, imported));
    });

    const node = t.importDeclaration(specifiers, t.stringLiteral(moduleSource));
    const code = generate(node, babelGeneratorOptions).code;
    changes.push({
      start: targetImportPos,
      end: targetImportPos,
      replacement: `${code}\n`,
    });
  }

  return changes;
}

/**
 * Export from a given module source. This methods operates export ... from statement:
 * @param {string} ast - Which module to manage export from statement.
 * @param {string} moduleSource - From which module source to add import from. If not found, the create an import line.
 * @index {string} defaultExport - The default import. If not need, pass it as null. The module should haven't import the default.
 * @index {string|array} namedExport - The named imports. If has imported, then do nothing.
 * @alias module:refactor.addExportFrom
 **/
function addExportFrom(ast, moduleSource, defaultExport, namedExport) {
  // Summary:
  //  Add export from source module. Such as export { xxx } from './x';
  let names = [];

  if (namedExport) {
    if (typeof namedExport === 'string') {
      names.push(namedExport);
    } else {
      names = names.concat(namedExport);
    }
  }

  const changes = [];
  const t = babelTypes;

  let targetExportPos = 0;
  let sourceExisted = false;
  traverse(ast, {
    ExportNamedDeclaration(path) {
      const node = path.node;
      targetExportPos = path.node.end + 1;
      if (!node.specifiers || !node.source || node.source.value !== moduleSource) return;
      sourceExisted = true;
      let newNames = [];
      const alreadyHaveDefaultExport = !!_.find(node.specifiers, s => _.get(s, 'local.name') === 'default');
      if (defaultExport && !alreadyHaveDefaultExport) newNames.push(defaultExport);

      newNames = newNames.concat(names);

      // only add names which don't exist
      newNames = newNames.filter(
        n => !_.find(node.specifiers, s => (_.get(s, 'exported.name') || _.get(s, 'local.name')) === n)
      );

      if (newNames.length > 0) {
        const newSpecifiers = [].concat(node.specifiers);
        newNames.forEach(n => {
          const local = t.identifier(n);
          const exported = local; // TODO: doesn't support local alias.
          if (n === defaultExport) {
            newSpecifiers.unshift(t.exportSpecifier(t.identifier('default'), exported));
          } else {
            newSpecifiers.push(t.exportSpecifier(local, exported));
          }
        });

        const newNode = Object.assign({}, node, { specifiers: newSpecifiers });
        const newCode = generate(newNode, babelGeneratorOptions).code;
        changes.push({
          start: node.start,
          end: node.end,
          replacement: newCode,
        });
      }
    },
  });

  if (changes.length === 0 && !sourceExisted) {
    const specifiers = [];
    if (defaultExport) {
      specifiers.push(t.exportSpecifier(t.identifier('default'), t.identifier(defaultExport)));
    }

    names.forEach(n => {
      const local = t.identifier(n);
      const exported = local;
      specifiers.push(t.exportSpecifier(local, exported));
    });

    const node = t.ExportNamedDeclaration(null, specifiers, t.stringLiteral(moduleSource));
    const code = generate(node, babelGeneratorOptions).code;
    changes.push({
      start: targetExportPos,
      end: targetExportPos,
      replacement: `${code}\n`,
    });
  }

  return changes;
}

function renameImportAsSpecifier(ast, oldName, newName) {
  let defNode = null;
  let changes = [];

  traverse(ast, {
    ImportSpecifier(path) {
      if (_.get(path.node, 'local.name') === oldName) {
        defNode = path.node.local;
      }
    },
  });
  if (defNode) {
    changes = changes.concat(identifier.renameIdentifier(ast, oldName, newName, defNode));
  }
  return changes;
}

function renameImportSpecifier(ast, oldName, newName, moduleSource) {
  // Summary:
  //  Rename the import(default, named) variable name and their reference.
  //  The simple example is to rename a component
  //  NOTE: only rename imported name!
  //  eg: import { A as A1 } from './A'; A -> B  import { B as A1 } from './A';
  //  import fetchList from './action';
  //  import { fetchList as fetchTopicList } from '../topic/action';

  let defNode = null;
  let changes = [];

  traverse(ast, {
    ImportDeclaration(path) {
      const node = path.node;
      if (moduleSource && _.get(node, 'source.value') !== moduleSource) return;
      node.specifiers.forEach(specifier => {
        if (
          (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportNamespaceSpecifier') &&
          _.get(specifier, 'local.name') === oldName
        ) {
          defNode = specifier.local;
        }

        // only rename imported specifier
        if (specifier.type === 'ImportSpecifier' && _.get(specifier, 'imported.name') === oldName) {
          if (_.get(specifier, 'local.name') === oldName) {
            defNode = specifier.local;
          } else {
            changes.push({
              start: specifier.imported.start,
              end: specifier.imported.end,
              replacement: newName,
            });
          }
        }
      });
    },
  });
  if (defNode) {
    changes = changes.concat(identifier.renameIdentifier(ast, oldName, newName, defNode));
  }
  return changes;
}

function renameExportSpecifier(ast, oldName, newName, moduleSource) {
  // It only rename export specifier but not references.
  const changes = [];
  traverse(ast, {
    ExportSpecifier(path) {
      const node = path.node;
      if (moduleSource && _.get(path.parentPath.node, 'source.value') !== moduleSource) return;

      if (_.get(node, 'local.name') === oldName) {
        changes.push({
          start: node.local.start,
          end: node.local.end,
          replacement: newName,
        });
      } else if (_.get(node, 'exported.name') === oldName) {
        changes.push({
          start: node.exported.start,
          end: node.exported.end,
          replacement: newName,
        });
      }
    },
  });
  return changes;
}

function renameModuleSource(ast, oldModuleSource, newModuleSource) {
  // Summary:
  //  Rename the module source for import/export xx from moduleSource.
  //  It only compares the string rather that resolve to the absolute path.

  const changes = [];

  function renameSource(path) {
    const node = path.node;
    if (node.source && node.source.value === oldModuleSource) {
      changes.push({
        start: node.source.start + 1,
        end: node.source.end - 1,
        replacement: newModuleSource,
      });
    }
  }

  traverse(ast, {
    ImportDeclaration: renameSource,
    ExportNamedDeclaration: renameSource,
  });

  return changes;
}

function removeImportSpecifier(ast, name) {
  // Remove import specifier by local name

  let names = name;
  if (typeof name === 'string') {
    names = [name];
  }
  const changes = [];
  traverse(ast, {
    ImportDeclaration(path) {
      const node = path.node;
      const multilines = node.loc.start.line !== node.loc.end.line;
      if (!node.specifiers) return;
      const newSpecifiers = node.specifiers.filter(s => !names.includes(s.local.name));
      if (newSpecifiers.length === 0) {
        // no specifiers, should delete the import statement
        changes.push({
          start: node.start,
          end: node.end,
          replacement: '',
        });
      } else if (newSpecifiers.length !== node.specifiers.length) {
        // remove the specifier import
        const newNode = Object.assign({}, node, { specifiers: newSpecifiers });
        let newCode = generate(newNode, {}).code;
        if (multilines) newCode = formatMultilineImport(newCode);
        changes.push({
          start: node.start,
          end: node.end,
          replacement: newCode,
        });
      }
    },
  });

  return changes;
}

function removeImportBySource(ast, moduleSource) {
  const changes = [];

  function removeBySource(path) {
    const node = path.node;
    if (!node.source) return;
    if (node.source.value === moduleSource) {
      changes.push({
        start: node.start,
        end: node.end,
        replacement: '',
      });
    }
  }
  traverse(ast, {
    ExportNamedDeclaration: removeBySource,
    ImportDeclaration: removeBySource,
  });

  return changes;
}

module.exports = {
  addImportFrom: common.acceptFilePathForAst(addImportFrom),
  addExportFrom: common.acceptFilePathForAst(addExportFrom),

  renameImportSpecifier: common.acceptFilePathForAst(renameImportSpecifier),
  renameImportAsSpecifier: common.acceptFilePathForAst(renameImportAsSpecifier),
  renameExportSpecifier: common.acceptFilePathForAst(renameExportSpecifier),

  removeImportSpecifier: common.acceptFilePathForAst(removeImportSpecifier),
  // removeExportSpecifier: common.acceptFilePathForAst(removeExportSpecifier),
  removeImportBySource: common.acceptFilePathForAst(removeImportBySource),

  renameModuleSource: common.acceptFilePathForAst(renameModuleSource),
};
