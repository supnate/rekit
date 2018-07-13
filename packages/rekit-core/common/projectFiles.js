// Load project files in project data format

const shell = require('shelljs');
const path = require('path');
const paths = require('../core/paths');

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

function readDir(dir) {
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
        icon: 'folder',
        id: rFile,
        children: res.elements,
      };
    } else {
      elementById[rFile] = {
        name: path.basename(file),
        type: 'file',
        icon: 'file',
        id: rFile,
      };
    }
  });
  sortElements(elements, elementById);
  return {
    elementById,
    elements,
  };
}

module.exports = {
  readDir,
};
