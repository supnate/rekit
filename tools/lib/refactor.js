'use strict';

// Summary:
//  Rename variables in a Rekit element

const _ = require('lodash');
const traverse = require('babel-traverse').default;
const vio = require('./vio');

function isStringMatch(str, match) {
  if (_.isString(match)) {
    return _.includes(str, match);
  } else if (_.isFunction(match)) {
    return match(str);
  }
  return match.test(str);
}

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
  const changes = [];
  function rename(path) {
    if (path.node.name === oldName && getDefNode(path.node.name, path.scope) === defNode) {
      path.node.name = newName;
      changes.push({
        start: path.node.start,
        end: path.node.end,
        replacement: newName,
      });
    }
  }
  traverse(ast, {
    JSXIdentifier: rename,
    Identifier: rename,
  });
  return changes;
}

function renameClassName(ast, oldName, newName) {
  // Summary:
  //  Rename the class name in a module
  // Return:
  //  All changes needed.

  let defNode = null;
  // Find the definition node of the class
  traverse(ast, {
    ClassDeclaration(path) {
      if (path.node.id && path.node.id.name === oldName) {
        defNode = path.node.id;
      }
    },
  });

  if (defNode) {
    return renameIdentifier(ast, oldName, newName, defNode);
  }
  return [];
}

function renameFunctionName(ast, oldName, newName) {
  // Summary:
  //  Rename the name of the function first found. Usually used by
  //  flat function definition file.

  let defNode = null;
  // Find the definition node of the class
  traverse(ast, {
    FunctionDeclaration(path) {
      if (path.node.id && path.node.id.name === oldName) {
        defNode = path.node.id;
      }
    },
  });

  if (defNode) {
    return renameIdentifier(ast, oldName, newName, defNode);
  }
  return [];
}

function renameImportSpecifier(ast, oldName, newName) {
  // Summary:
  //  Rename the import(default, named) variable name and their reference.
  //  The simple example is to rename a component
  let defNode = null;
  // Find the definition node of the class
  traverse(ast, {
    ImportDefaultSpecifier(path) {
      if (path.node.local.name === oldName) {
        defNode = path.node.local;
      }
    },
    ImportSpecifier(path) {
      if (path.node.local.name === oldName) {
        defNode = path.node.local;
      }
    }
  });
  if (defNode) {
    return renameIdentifier(ast, oldName, newName, defNode);
  }
  return [];
}

function renameExportSpecifier(ast, oldName, newName) {
  const changes = [];
  traverse(ast, {
    ExportDefaultSpecifier(path) {
      if (path.node.exported.name === oldName) {
        changes.push({
          start: path.node.exported.start,
          end: path.node.exported.end,
          replacement: newName,
        });
      }
    },
    ExportSpecifier(path) {
      if (path.node.local.name === oldName) {
        changes.push({
          start: path.node.local.start,
          end: path.node.local.end,
          replacement: newName,
        });
      }
    }
  });
  return changes;
}

function renameObjectProperty(ast, oldName, newName) {
  // Summary:
  //  Rename the object property and only for non-computed identifier property
  // Return:
  //  All changes needed.

  const changes = [];
  traverse(ast, {
    ObjectProperty(path) {
      // Simple replace literal strings
      if (path.node.key.type === 'Identifier' && path.node.key.name === oldName && !path.node.computed) {
        changes.push({
          start: path.node.key.start,
          end: path.node.key.end,
          replacement: newName,
        });
      }
    },
  });
  return changes;
}

function renameStringLiteral(ast, oldName, newName) {
  // Summary:
  //  Rename the string literal in ast
  // Return:
  //  All changes needed.

  const changes = [];
  traverse(ast, {
    StringLiteral(path) {
      // Simple replace literal strings
      if (path.node.value === oldName) {
        changes.push({
          start: path.node.start + 1,
          end: path.node.end - 1,
          replacement: newName,
        });
      }
    },
  });
  return changes;
}

function renameCssClassName(ast, oldName, newName) {
  // Summary:
  //  Rename the css class name in a JSXAttribute
  // Return:
  //  All changes needed.

  const changes = [];
  // Find the definition node of the className attribute
  // const reg = new RegExp(`(^| +)(${oldName})( +|$)`);
  traverse(ast, {
    StringLiteral(path) {
      // Simple replace literal strings
      const i = path.node.value.indexOf(oldName);
      if (i >= 0) {
        changes.push({
          start: path.node.start + i + 1,
          end: path.node.start + i + oldName.length + 1,
          replacement: newName,
        });
      }
    },
  });
  return changes;
}

function lineIndex(lines, match, fromMatch) {
  if (fromMatch && !_.isNumber(fromMatch)) {
    fromMatch = lineIndex(lines, fromMatch);
  }
  if (_.isString(match)) {
    // Match string
    return _.findIndex(lines, l => l.indexOf(match) >= 0, fromMatch || 0);
  } else if (_.isFunction(match)) {
    // Callback
    return _.findIndex(lines, match);
  }

  // Regular expression
  return _.findIndex(lines, l => match.test(l), fromMatch || 0);
}

function lastLineIndex(lines, match) {
  if (_.isString(match)) {
    // String
    return _.findLastIndex(lines, l => l.indexOf(match) >= 0);
  } else if (_.isFunction(match)) {
    // Callback
    return _.findLastIndex(lines, match);
  }

  // Regular expression
  return _.findLastIndex(lines, l => match.test(l));
}

function removeLines(lines, str) {
  return _.remove(lines, line => isStringMatch(line, str));
}

function addImportLine(lines, importLine) {
  // Summary:
  //  Add import npm module to source code (abs path)
  //  Use text matching instead of ast.

  const i = lastLineIndex(lines, /^import /);
  lines.splice(i + 1, 0, importLine);
}

function addExportFrom(filePath, exportLine) {
  // Summary:
  //  Add export xxx from '.xxx' at the top. Usually used by entry files such as index.js
  const lines = vio.getLines(filePath);
  const i = lastLineIndex(lines, /^export .* from /);
  lines.splice(i + 1, 0, exportLine);
}

function removeExportFrom(filePath, modulePath) {
  // Summary:
  //  Remove export xxx from '.xxx' at the top. Usually used by entry files such as index.js
  const lines = vio.getLines(filePath);
  removeLines(lines, new RegExp(`export +.* +from +'${modulePath}'`));
}

function renameExportFrom(ast, oldName, newName, oldModulePath, newModulePath) {
  // Summary:
  //  Rename export xxx from '.xxx' at the top. Usually used by entry files such as index.js

  let isFile = _.isString(ast);
  if (isFile) {
    ast = vio.getAst(ast);
  }

  const changes = [];

  if (isFile) {
    updateFile(file, changes);
  }

  return changes;
}

function updateSourceCode(code, changes) {
  // Summary:
  //  This must be called before code is changed some places else rather than ast

  changes.sort((c1, c2) => c2.start - c1.start);
  // Remove same or overlapped changes
  const newChanges = _.reduce(changes, (prev, curr) => {
    if (!prev.length || _.last(prev).start > curr.end) {
      prev.push(curr);
    }
    return prev;
  }, []);

  const chars = code.split('');
  newChanges.forEach((c) => {
    chars.splice(c.start, c.end - c.start, c.replacement);
  });
  return chars.join('');
}

function updateFile(filePath, changes) {
  // Summary:
  //  Update the source file by changes.

  if (_.isFunction(changes)) {
    const ast = vio.getAst(filePath);
    changes = changes(ast);
  }
  let code = vio.getContent(filePath);
  code = updateSourceCode(code, changes);
  vio.save(filePath, code);
}

module.exports = {
  renameClassName,
  renameFunctionName,
  renameImportSpecifier,
  renameExportSpecifier,
  renameObjectProperty,
  renameCssClassName,
  renameStringLiteral,
  updateSourceCode,
  updateFile,
  lineIndex,
  lastLineIndex,
  addImportLine,
  removeLines,

  addExportFrom,
  removeExportFrom,
  renameExportFrom,
};
