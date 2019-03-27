'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

// Credit to: http://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
function copyFileSync(source, target) {
  let targetFile = target;

  // if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

// Credit to: http://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
function copyFolderRecursiveSync(source, target, filter) {
  let files = [];

  // check if folder needs to be created or integrated
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  // copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      if (filter && !filter(curSource)) return;
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, path.join(target, path.basename(curSource)), filter);
      } else {
        copyFileSync(curSource, target);
      }
    });
  }
}

function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = dirPath + '/' + file; // eslint-disable-line
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

module.exports = {
  copyFileSync,
  copyFolderRecursiveSync,
  deleteFolderRecursive,
};
