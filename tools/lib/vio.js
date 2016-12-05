'use strict';

// Virtual IO, create, update and delete files in memory until flush to the disk.

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const jsdiff = require('diff');
const colors = require('colors/safe');
const babylon = require('babylon');
const generate = require('babel-generator').default;

const prjRoot = path.join(__dirname, '../../');

let toSave = {};
let toDel = {};
let fileLines = {};
let dirs = {};
let asts = {};
let mvs = {}; // Files to move

function printDiff(diff) {
  diff.forEach((line) => {
    if (line.added) {
      line.value.split('\n').forEach(l => l && console.log(colors.green('  +  ') + colors.gray(l)));
    } else if (line.removed) {
      line.value.split('\n').forEach(l => l && console.log(colors.red('  -  ') + colors.gray(l)));
    }
  });
}
module.exports = {
  getLines(filePath) {
    if (_.isArray(filePath)) {
      // If it's already lines, return the arg.
      return filePath;
    }

    if (!fileLines[filePath]) {
      // if the file is moved, find the real file path
      const realFilePath = _.findKey(mvs, s => s === filePath) || filePath;
      fileLines[filePath] = shell.cat(realFilePath).split(/\r?\n/);
    }
    return fileLines[filePath];
  },

  getContent(filePath) {
    return this.getLines(filePath).join('\n');
  },

  getAst(filePath) {
    if (!asts[filePath]) {
      const code = this.getLines(filePath).join('\n');
      const ast = babylon.parse(code, {
        // parse in strict mode and allow module declarations
        sourceType: 'module',
        plugins: [
          'jsx',
          'flow',
          'doExpressions',
          'objectRestSpread',
          'decorators',
          'classProperties',
          'exportExtensions',
          'asyncGenerators',
          'functionBind',
          'functionSent',
          'dynamicImport',
        ]
      });
      asts[filePath] = ast;
    }
    return asts[filePath];
  },

  saveAst(filePath, ast) {
    asts[filePath] = ast;
    // Update file lines when ast is changed
    this.save(filePath, generate(ast).code.split(/\r?\n/));
  },

  fileExists(filePath) {
    return !!toSave[filePath] && !toDel[filePath];
  },

  dirExists(dir) {
    return !!dirs[dir] && !toDel[dir];
  },

  ensurePathDir(fullPath) {
    if (!shell.test('-e', path.dirname(fullPath))) {
      shell.mkdir('-p', path.dirname(fullPath));
    }
  },

  put(filePath, lines) {
    if (typeof lines === 'string') lines = lines.split(/\r?\n/);
    fileLines[filePath] = lines;
    delete asts[filePath]; // ast needs to be updated
  },

  mkdir(dir) {
    dirs[dir] = true;
  },

  save(filePath, lines) {
    if (lines) {
      this.put(filePath, lines);
    }
    toSave[filePath] = true;
  },

  mv(oldPath, newPath) {
    if (toDel[oldPath] || !shell.test('-e', oldPath)) {
      this.log('Error: no file to move: ', 'red', oldPath);
      throw new Error('No file to move');
    }

    if (shell.test('-e', newPath)) {
      this.log('Error: target file already exists: ', 'red', newPath);
      throw new Error('Target file already exists');
    }

    if (fileLines[oldPath]) {
      fileLines[newPath] = fileLines[oldPath];
      delete fileLines[oldPath];
    }

    if (asts[oldPath]) {
      asts[newPath] = asts[oldPath];
      delete asts[oldPath];
    }
    // if the file has already been moved
    oldPath = _.findKey(mvs, s => s === oldPath) || oldPath;
    mvs[oldPath] = newPath;
  },

  del(filePath) {
    toDel[filePath] = true;
  },

  reset() {
    toSave = {};
    toDel = {};
    fileLines = {};
    dirs = {};
    asts = {};
    mvs = {};
  },

  log(label, color, filePath, toFilePath) {
    const p = filePath.replace(prjRoot, '');
    const to = toFilePath ? toFilePath.replace(prjRoot, '') : '';
    console.log(colors[color](label + p + (to ? (' to ' + to) : '')));
  },

  flush() {
    for (const dir of Object.keys(dirs)) {
      if (!shell.test('-e', dir)) {
        shell.mkdir('-p', dir);
      }
    }

    // Delete files first
    for (const filePath of Object.keys(toDel)) {
      if (!shell.test('-e', filePath)) {
        this.log('Warning: no file to delete: ', 'yellow', filePath);
      } else {
        shell.rm('-rf', filePath);
        this.log('Deleted: ', 'magenta', filePath);
      }
    }

    // Move files
    for (const filePath of Object.keys(mvs)) {
      if (!shell.test('-e', filePath)) {
        this.log('Warning: no file to move: ', 'yellow', filePath);
      } else {
        shell.mv(filePath, mvs[filePath]);
        this.log('Moved: ', 'green', filePath, mvs[filePath]);
      }
    }

    // Create/update files
    for (const filePath of Object.keys(toSave)) {
      const newContent = this.getLines(filePath).join('\n');
      if (shell.test('-e', filePath)) {
        const oldContent = shell.cat(filePath).split(/\r?\n/).join('\n');
        if (oldContent === newContent) {
          this.log('Warning: nothing is changed for: ', 'yellow', filePath);
          continue;
        } else {
          this.log('Updated: ', 'cyan', filePath);
          printDiff(jsdiff.diffLines(oldContent, newContent));
        }
      } else {
        this.ensurePathDir(filePath);
        this.log('Created: ', 'blue', filePath);
      }
      shell.ShellString(newContent).to(filePath);
    }
  }
};
