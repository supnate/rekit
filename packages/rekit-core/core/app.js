const _ = require('lodash');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const paths = require('./paths');
const deps = require('./deps');

const plugin = require('./plugin');

function getProjectData() {
  const plugins = plugin.getPlugins('app.getProjectData');
  const prjData = {};
  if (plugins.length) {
    plugins.forEach(p => Object.assign(prjData, p.app.getProjectData()));
  }
  if (!prjData.elements || !prjData.elementById) Object.assign(prjData, readDir(paths.map('src')));
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

const DIR_CACHE = {};
function readDir(dir, useCache) {
  if (DIR_CACHE[dir] && useCache) {
    return DIR_CACHE[dir];
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
      elementById[rFile] = {
        name: path.basename(file),
        type: 'folder',
        id: rFile,
        children: res.elements,
      };
    } else {
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
        // if (size < 50000) fileEle.deps = deps.getDeps(rFile);
      }
      elementById[rFile] = fileEle;
    }
  });
  sortElements(elements, elementById);
  DIR_CACHE[dir] = { elementById, elements };
  return {
    elementById,
    elements,
  };
}

function setFileChanged(file) {
  if (!fs.existsSync(file)) {
    removeFileFromCache(file);
  }
}

function removeFileFromCache(file) {}

function getFileElement() {}

module.exports = {
  getProjectData,
  readDir,
  setFileChanged,
};
