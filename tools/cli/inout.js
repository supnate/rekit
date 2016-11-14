// const _ = require('lodash');
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

  put(filePath, lines) {
    fileLines[filePath] = lines;
  },

  save(filePath) {
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
    for (const filePath of toDel) {
      shell.rm(filePath);
    }

    for (const filePath of toSave) {
      shell.ShellString(this.getLines(filePath.join('\n'))).to(filePath);
    }
  }
};
