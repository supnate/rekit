// const _ = require('lodash');
const path = require('path');
const shell = require('shelljs');

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

  flush() {
    // Delete files, then write files
    const prjRoot = path.join(__dirname, '../../../');
    for (const filePath of Object.keys(toDel)) {
      console.log('Deleting: ', filePath.replace(prjRoot, ''));
      shell.rm(filePath);
    }

    for (const filePath of Object.keys(toSave)) {
      if (shell.test('-e', filePath)) {
        console.log('Updating: ', filePath.replace(prjRoot, ''));
      } else {
        console.log('Creating: ', filePath.replace(prjRoot, ''));
      }
      shell.ShellString(this.getLines(filePath).join('\n')).to(filePath);
    }
  }
};
