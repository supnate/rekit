const _ = require('lodash');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const paths = require('./paths');
const deps = require('./deps');
const files = require('./files');
const plugin = require('./plugin');

const app = {};

function getProjectData() {
  const plugins = plugin.getPlugins('app.getProjectData');
  const prjData = {};
  if (plugins.length) {
    plugins.forEach(p => Object.assign(prjData, p.app.getProjectData()));
  }
  if (!prjData.elements || !prjData.elementById) Object.assign(prjData, files.readDir(paths.map('src')));
  app.lastGetProjectDataTimestamp = files.lastChangeTime;
  return prjData;
}

function sortElements(elements, elementById) {
  elements.sort((a, b) => {
    a = elementById[a];
    b = elementById[b];
    if (!a || !b) console.log(elements, elementById);
    if (a.children && !b.children) return -1;
    else if (!a.children && b.children) return 1;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  return elements;
}

const dirCache = {};
const parentHash = {};
function readDir(dir, useCache) {
  if (dirCache[dir] && useCache) {
    return dirCache[dir];
  }
  const prjRoot = paths.getProjectRoot();

  dir = dir || paths.map('src');

  const elementById = {};
  const elements = [];
  shell.ls(dir).forEach(file => {
    file = paths.join(dir, file);
    const rFile = file.replace(prjRoot, '');
    elements.push(rFile);
    if (shell.test('-d', file)) {
      const res = readDir(file);
      Object.assign(elementById, res.elementById);
      const dirEle = {
        name: path.basename(file),
        type: 'folder',
        id: rFile,
        children: res.elements,
      };
      elementById[rFile] = dirEle;
      res.elements.forEach(id => {
        parentHash[id] = dirEle;
      });
    } else {
      const fileEle = getFileElement(file);

      // const ext = path.extname(file).replace('.', '');
      // const size = fs.statSync(file).size;
      // const fileEle = {
      //   name: path.basename(file),
      //   type: 'file',
      //   ext,
      //   size,
      //   id: rFile,
      // };
      // const fileDeps = size < 50000 ? deps.getDeps(rFile) : null;
      // if (fileDeps) {
      //   fileEle.views = [
      //     { key: 'diagram', name: 'Diagram' },
      //     {
      //       key: 'code',
      //       name: 'Code',
      //       target: rFile,
      //       isDefault: true,
      //     },
      //   ];
      //   fileEle.deps = fileDeps;
      //   // if (size < 50000) fileEle.deps = deps.getDeps(rFile);
      // }
      elementById[rFile] = fileEle;
    }
  });
  sortElements(elements, elementById);
  if (useCache) dirCache[dir] = { elementById, elements };
  return {
    elementById,
    elements,
  };
}

function setFileChanged(file) {
  if (!fs.existsSync(file)) {
    removeFileFromCache(file);
  } else {
    updateFileInCache(file);
  }
}

function removeFileFromCache(file) {
  const prjRoot = paths.getProjectRoot();
  const rFile = file.replace(prjRoot, file);
  const dirEle = parentHash[rFile];
  if (dirEle) {
    // remove it from folder
    _.pull(dirEle.elements, rFile);
  }
  delete parentHash[rFile];
}

function updateFileInCache(file) {
  const prjRoot = paths.getProjectRoot();
  const rFile = file.replace(prjRoot, '');

  Object.values(dirCache).forEach(cache => {});
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

Object.assign(app, {
  getProjectData,
  readDir,
  setFileChanged,
});

module.exports = app;
