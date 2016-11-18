'use strict';

// Virtual IO, create, update and delete files in memory until flush to the disk.

const shell = require('shelljs');
const colors = require('colors/safe');
const helpers = require('./helpers');

let toSave = {};
let toDel = {};
let fileLines = {};

module.exports = {
  getLines(filePath) {
    if (!fileLines[filePath]) {
      fileLines[filePath] = shell.cat(filePath).split(/\r?\n/);
    }
    return fileLines[filePath];
  },

  exists(filePath) {
    return !!fileLines[filePath];
  },

  put(filePath, lines) {
    fileLines[filePath] = lines;
  },

  save(filePath, lines) {
    if (lines) {
      fileLines[filePath] = lines;
    }
    toSave[filePath] = true;
  },

  del(filePath) {
    toDel[filePath] = true;
  },

  reset() {
    toSave = {};
    toDel = {};
    fileLines = {};
  },

  log(label, color, filePath) {
    const p = filePath.replace(helpers.getProjectRoot(), '');
    console.log(colors[color](label + p));
  },

  flush() {
    // Delete files first, then write files

    for (const filePath of Object.keys(toDel)) {
      if (!shell.test('-e', filePath)) {
        this.log('Warning: no file to delete: ', 'yellow', filePath);
      } else {
        shell.rm(filePath);
        this.log('Deleted: ', 'magenta', filePath);
      }
    }


    for (const filePath of Object.keys(toSave)) {
      if (shell.test('-e', filePath)) {
        this.log('Updated: ', 'cyan', filePath);
      } else {
        this.log('Created: ', 'blue', filePath);
      }
      shell.ShellString(this.getLines(filePath).join('\n')).to(filePath);
    }
  }
};
