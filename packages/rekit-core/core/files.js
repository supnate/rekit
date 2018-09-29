const _ = require('lodash');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const paths = require('./paths');
const deps = require('./deps');

// Maintain file structure in memory and keep sync with disk if any file changed.

function sortElements(elements, elementById) {
  elements.sort((a, b) => {
    a = elementById[a];
    b = elementById[b];
    if (!a || !b) {
      console.log('Error in sortElement'); // should not happen?
      return 0;
    }
    if (a.children && !b.children) return -1;
    else if (!a.children && b.children) return 1;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  return elements;
}

const dirCache = {};
const parentHash = {};
const allElementById = {};

function readDir(dir, useCache) {
  console.log('read dir');
  dir = dir || paths.map('src');
  if (!dirCache[dir] || !useCache) {
    addDirToCache(dir);
  }
  return dirCache[dir];
}

function getDirElement(dir) {
  const prjRoot = paths.getProjectRoot();
  // const id = dir.replace(prjRoot, '');

  const children = [];

  shell.ls(dir).forEach(file => {
    file = paths.join(dir, file);
    const rFile = file.replace(prjRoot, '');
    children.push(rFile);
    if (shell.test('-d', file)) {
      const res = getDirElement(file);
      const dirEle = {
        name: path.basename(file),
        type: 'folder',
        id: rFile,
        children: res.elements,
      };
      allElementById[rFile] = dirEle;
      res.elements.forEach(id => {
        parentHash[id] = dirEle;
      });
    } else {
      const fileEle = getFileElement(file);
      allElementById[rFile] = fileEle;
    }
  });
  sortElements(children, allElementById);

  return { elements: children };
}

function getFileElement(file) {
  const prjRoot = paths.getProjectRoot();
  const rFile = file.replace(prjRoot, '');
  const ext = path.extname(file).replace('.', '');
  const size = fs.statSync(file).size;
  const fileEle = {
    name: path.basename(file),
    type: 'file',
    ext,
    size,
    id: rFile,
  };
  const fileDeps = size < 50000 ? deps.getDeps(rFile) : null;
  if (fileDeps) {
    fileEle.views = [
      { key: 'diagram', name: 'Diagram' },
      {
        key: 'code',
        name: 'Code',
        target: rFile,
        isDefault: true,
      },
    ];
    fileEle.deps = fileDeps;
  }
  return fileEle;
}

function setFileChanged(file) {
  const prjRoot = paths.getProjectRoot();
  if (!fs.existsSync(file)) {
    // File deleted
    deleteFileInCache(file);
  } else if (!parentHash[file.replace(prjRoot, '')]) {
    // File created
    addFileToCache(file);
  }
}

function addFileToCache(file) {
  if (shell.test('-d', file)) {
  } else {
  }
}

function deleteFileInCache(file) {
  const prjRoot = paths.getProjectRoot();
  const rFile = file.replace(prjRoot, file);
  const dirEle = parentHash[rFile];
  if (dirEle) {
    // remove it from folder
    _.pull(dirEle.elements, rFile);
  }
  delete parentHash[rFile];
}

function addDirToCache(dir) {
  const dirEle = getDirElement(dir);
  dirCache[dir] = dirEle;
}
function deleteDirInCache(dir) {}

module.exports = {
  readDir,
  setFileChanged,
};
