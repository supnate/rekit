'use strict';

// Virtual IO, create, update and delete files in memory until flush to the disk.
// NOTE: it only supports text files.

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const jsdiff = require('diff');
const colors = require('colors/safe');
// const babylon = require('babylon');
// const generate = require('babel-generator').default;
// const utils = require('./utils');
const paths = require('./paths');

// const prjRoot = paths.getProjectRoot();

let toSave = {};
let toDel = {};
let fileLines = {};
let dirs = {};
// let asts = {};
let mvs = {}; // Files to move
let mvDirs = {}; // Folders to move
// let failedToParse = {};

function printDiff(diff) {
  diff.forEach(line => {
    if (line.added) {
      line.value.split('\n').forEach(l => l && console.log(colors.green(' +++ ') + colors.gray(l)));
    } else if (line.removed) {
      line.value.split('\n').forEach(l => l && console.log(colors.red(' --- ') + colors.gray(l)));
    }
  });
}

function log(label, color, filePath, toFilePath) {
  const prjRoot = paths.getProjectRoot();
  const p = filePath.replace(prjRoot, '');
  const to = toFilePath ? toFilePath.replace(prjRoot, '') : '';
  console.log(colors[color](label + p + (to ? ' to ' + to : '')));
}

// function mapPathAfterMvDir() {}
function getLines(filePath) {
  if (_.isArray(filePath)) {
    // If it's already lines, return the arg.
    return filePath;
  }

  if (!fileLines[filePath]) {
    // if the file is moved, find the real file path
    let realFilePath = _.findKey(mvs, s => s === filePath) || filePath;
    // if dir is moved, find the original file path
    Object.keys(mvDirs).forEach(oldDir => {
      if (_.startsWith(realFilePath, mvDirs[oldDir])) {
        realFilePath = realFilePath.replace(mvDirs[oldDir], oldDir);
      }
    });
    // console.log('real file path: ', Object.keys(fileLines), realFilePath);
    const absPath = paths.map(realFilePath);
    if (!shell.test('-e', absPath)) {
      throw new Error("Can't find such file: " + realFilePath);
    }
    fileLines[filePath] = shell.cat(absPath).split(/\r?\n/);
  }
  return fileLines[filePath];
}

function getContent(filePath) {
  return getLines(filePath).join('\n');
}

// function getAst(filePath) {
//   if (_.startsWith(utils.getRelativePath(filePath), 'src/libs/')) return null; // ignore libs folder to parse
//   if (!asts[filePath]) {
//     const code = getLines(filePath).join('\n');
//     try {
//       const ast = babylon.parse(code, {
//         // parse in strict mode and allow module declarations
//         sourceType: 'module',
//         plugins: [
//           'jsx',
//           'flow',
//           'doExpressions',
//           'objectRestSpread',
//           'decorators',
//           'classProperties',
//           'exportExtensions',
//           'asyncGenerators',
//           'functionBind',
//           'functionSent',
//           'dynamicImport',
//         ],
//       });
//       if (!ast) {
//         failedToParse[filePath] = true;
//         return null;
//         // utils.fatalError(`Error: failed to parse ${filePath}, please check syntax.`);
//       }
//       delete failedToParse[filePath];
//       asts[filePath] = ast;
//       ast._filePath = filePath;
//     } catch (e) {
//       failedToParse[filePath] = true;
//       return null;
//       // utils.fatalError(`Error: failed to parse ${filePath}, please check syntax.`);
//     }
//   }
//   return asts[filePath];
// }

// function assertAst(ast, filePath) {
//   if (!ast) {
//     reset(); // eslint-disable-line
//     utils.fatalError(`Failed to parse ${filePath}, please fix and try again.`);
//   }
// }

// function getFilesFailedToParse() {
//   return failedToParse;
// }

function fileExists(filePath) {
  if (toDel[filePath]) return false;
  return (
    !!_.findKey(mvs, s => s === filePath) || // to be moved
    !!fileLines[filePath] ||
    !!toSave[filePath] ||
    shell.test('-e', paths.map(filePath))
  );
}

function fileNotExists(filePath) {
  return !fileExists(filePath);
}

function dirExists(dir) {
  return (!!dirs[dir] && !toDel[dir]) || (shell.test('-e', paths.map(dir)) && shell.test('-d', paths.map(dir)));
}

function dirNotExists(dir) {
  return !dirExists(dir);
}

function ensurePathDir(fullPath) {
  const absPath = paths.map(fullPath);
  if (!shell.test('-e', path.dirname(absPath))) {
    shell.mkdir('-p', path.dirname(absPath));
  }
}

function put(filePath, lines) {
  if (typeof lines === 'string') lines = lines.split(/\r?\n/);
  fileLines[filePath] = lines;
  // delete asts[filePath]; // ast needs to be updated
}

function mkdir(dir) {
  dirs[dir] = true;
}

function save(filePath, lines) {
  if (_.isString(lines) || _.isArray(lines)) {
    put(filePath, lines);
  }
  toSave[filePath] = true;
}

// function saveAst(filePath, ast) {
//   asts[filePath] = ast;
//   // Update file lines when ast is changed
//   save(filePath, generate(ast).code.split(/\r?\n/));
// }

function move(oldPath, newPath) {
  if (toDel[oldPath] || !fileExists(oldPath)) {
    log('Error: no file to move: ', 'red', oldPath);
    throw new Error('No file to move');
  }

  if (fileExists(newPath)) {
    log('Error: target file already exists: ', 'red', newPath);
    throw new Error('Target file already exists');
  }
  if (fileLines[oldPath]) {
    fileLines[newPath] = fileLines[oldPath];
    delete fileLines[oldPath];
  }

  // if (asts[oldPath]) {
  //   asts[newPath] = asts[oldPath];
  //   delete asts[oldPath];
  // }

  if (toSave[oldPath]) {
    toSave[newPath] = true;
    delete toSave[oldPath];
  }

  if (toDel[oldPath]) {
    delete toDel[oldPath];
  }
  // if the file has already been moved
  oldPath = _.findKey(mvs, s => s === oldPath) || oldPath;
  mvs[oldPath] = newPath;
}

function moveDir(oldPath, newPath) {
  const updateKeys = obj => {
    _.keys(obj).forEach(key => {
      if (_.startsWith(key, oldPath)) {
        const value = obj[key];
        delete obj[key];
        const newKey = newPath + key.slice(oldPath.length);
        obj[newKey] = value;
      }
    });
  };

  updateKeys(toSave);
  updateKeys(toDel);
  updateKeys(fileLines);
  updateKeys(dirs);
  // updateKeys(asts);
  updateKeys(mvs);
  // updateKeys(failedToParse);

  const invertedMvs = _.invert(mvs);
  updateKeys(invertedMvs);
  mvs = _.invert(invertedMvs);

  mvDirs[oldPath] = newPath;
}

function ls(folder) {
  // Summary:
  //  List files of a folder, should contain both disk files and new created files in memory
  //  and it should consider mvDir

  let diskFiles = [];
  let realFolder = folder;
  if (!shell.test('-e', realFolder)) {
    // it may be moved
    _.forOwn(mvDirs, (value, key) => {
      if (_.startsWith(folder, value)) {
        realFolder = folder.replace(new RegExp(`^${_.escapeRegExp(value)}`), key);
        return false;
      }
      return true;
    });
  }
  if (shell.test('-e', realFolder)) {
    diskFiles = shell.ls(realFolder).map(f => paths.join(folder, f));
  }
  const memoFiles = Object.keys(toSave).filter(file => _.startsWith(file, folder) && !toDel[file]);
  return _.union(diskFiles, memoFiles);
}

function del(filePath, noWarning) {
  toDel[filePath] = noWarning ? 'no-warning' : true;
  delete toSave[filePath];
}

function reset() {
  toSave = {};
  toDel = {};
  fileLines = {};
  dirs = {};
  // asts = {};
  mvs = {};
  mvDirs = {};
}

function flush() {
  const prjRoot = paths.getProjectRoot();
  const res = [];
  Object.keys(dirs).forEach(dir => {
    const absDir = paths.map(dir);
    if (!shell.test('-e', absDir)) {
      shell.mkdir('-p', absDir);
      log('Created: ', 'blue', dir);
      res.push({
        type: 'create-dir',
        file: dir,
      });
    }
  });

  // Move directories
  Object.keys(mvDirs).forEach(oldDir => {
    const absOldDir = paths.map(oldDir);
    if (!shell.test('-e', absOldDir)) {
      log('Warning: no dir to move: ', 'yellow', absOldDir);
      res.push({
        type: 'mv-file-warning',
        warning: 'no-file',
        file: oldDir,
      });
    } else {
      shell.mv(absOldDir, paths.map(mvDirs[oldDir]));
      log('Moved dir: ', 'green', oldDir, mvDirs[oldDir]);
      res.push({
        type: 'mv-file',
        file: oldDir,
      });
    }
  });

  // Delete files/folders
  Object.keys(toDel).forEach(filePath => {
    const absFilePath = paths.map(filePath);
    if (!fs.existsSync(absFilePath)) {
      if (toDel[filePath] !== 'no-warning') log('Warning: no file to delete: ', 'yellow', filePath);
      res.push({
        type: 'del-file-warning',
        warning: 'no-file',
        file: filePath,
      });
    } else {
      // fs.unlinkSync(absFilePath);
      shell.rm('-rf', absFilePath);
      log('Deleted: ', 'magenta', filePath);
      res.push({
        type: 'del-file',
        file: filePath,
      });
    }
  });

  // Move files
  Object.keys(mvs).forEach(filePath => {
    const absFilePath = paths.map(filePath);
    if (!shell.test('-e', absFilePath)) {
      log('Warning: no file to move: ', 'yellow', absFilePath);
      res.push({
        type: 'mv-file-warning',
        warning: 'no-file',
        file: filePath,
      });
    } else {
      ensurePathDir(mvs[filePath]);
      shell.mv(filePath, mvs[filePath]);
      log('Moved: ', 'green', filePath, mvs[filePath]);
      res.push({
        type: 'mv-file',
        file: filePath.replace(prjRoot, ''),
      });
    }
  });

  // Create/update files
  Object.keys(toSave).forEach(filePath => {
    const newContent = getLines(filePath).join('\n');
    const absFilePath = paths.map(filePath);
    if (fs.existsSync(absFilePath)) {
      const oldContent = fs
        .readFileSync(absFilePath)
        .toString()
        .split(/\r?\n/)
        .join('\n');
      if (oldContent === newContent) {
        return;
      }
      log('Updated: ', 'cyan', filePath);
      const diff = jsdiff.diffLines(oldContent, newContent);
      res.push({
        type: 'update-file',
        diff,
        file: filePath,
      });
      printDiff(diff);
    } else {
      ensurePathDir(filePath);
      log('Created: ', 'blue', filePath);
      res.push({
        type: 'create-file',
        file: filePath,
      });
    }
    fs.writeFileSync(absFilePath, newContent);
    // shell.ShellString(newContent).to(filePath);
  });

  return res;
}

module.exports = {
  getLines,
  getContent,
  // getAst,
  // assertAst,
  // getFilesFailedToParse,
  // saveAst,
  fileExists,
  fileNotExists,
  dirExists,
  dirNotExists,
  ensurePathDir,
  put,
  mkdir,
  moveDir,
  save,
  move,
  del,
  reset,
  log,
  flush,
  ls,
};
