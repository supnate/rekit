const _ = require('lodash');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const paths = require('./paths');
const deps = require('./deps');
const chokidar = require('chokidar');
const EventEmitter = require('events');

// Maintain file structure in memory and keep sync with disk if any file changed.

const dirCache = {};
const parentHash = {};
const allElementById = {};
const byId = id => allElementById[id];

const watchers = {};

const files = new EventEmitter();

const emitChange = _.debounce(() => {
  files.emit('change');
}, 500);

function readDir(dir, forceReload) {
  dir = dir || paths.map('src');
  if (!watchers[dir]) startWatch(dir);
  console.log('readDir', dir);
  if (!dirCache[dir]) {
    addDirToCache(dir);
  }
  return dirCache[dir];
}

function startWatch(dir) {
  const w = chokidar.watch(dir, { persistent: true });
  w.on('ready', () => {
    w.on('add', onAdd);
    w.on('change', onChange);
    w.on('unlink', onUnlink);
    w.on('addDir', onAddDir);
    w.on('unlinkDir', onUnlinkDir);
  });
  watchers[dir] = w;
}

const setLastChangeTime = () => {
  files.lastChangeTime = Date.now();
};

function onAdd(file) {
  console.log('on add', arguments);
  setLastChangeTime();
  emitChange();

  const prjRoot = paths.getProjectRoot();
  const rFile = file.replace(prjRoot, '');
  allElementById[rFile] = getFileElement(file);
}
function onUnlink() {
  console.log('on unlink', arguments);
  setLastChangeTime();
  emitChange();
}
function onChange() {
  console.log('on change', arguments);
  setLastChangeTime();
  emitChange();
}
function onAddDir() {
  console.log('on add dir', arguments);
  setLastChangeTime();
  emitChange();
}
function onUnlinkDir() {
  console.log('on unlink dir', arguments);
  setLastChangeTime();
  emitChange();
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

// function setFileChanged(file) {
//   const prjRoot = paths.getProjectRoot();
//   if (!fs.existsSync(file)) {
//     // File deleted
//     deleteFileInCache(file);
//   } else if (!byId(file.replace(prjRoot, ''))) {
//     // File created
//     addFileToCache(file);
//   }
// }

// function addFileToCache(file) {
//   if (shell.test('-d', file)) {
//   } else {
//   }
// }

// function deleteFileInCache(file) {
//   const prjRoot = paths.getProjectRoot();
//   const rFile = file.replace(prjRoot, file);
//   const dirEle = parentHash[rFile];
//   if (dirEle) {
//     // remove it from folder
//     _.pull(dirEle.elements, rFile);
//   }
//   delete parentHash[rFile];
// }

function addDirToCache(dir) {
  const dirEle = getDirElement(dir);
  dirCache[dir] = dirEle;
}
// function deleteDirInCache(dir) {}

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

files.readDir = readDir;
// files.setFileChanged = setFileChanged;

module.exports = files;
