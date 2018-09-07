const { vio, refactor } = rekit.core;

function add(filePath) {
  if (vio.fileExists(filePath)) throw new Error('File already exists: ' + filePath);
  vio.save(filePath, '');
}

function move(source, dest) {
  
}

function remove(filePath) {
  vio.del(filePath);
}

module.exports = {
  add,
  remove,
  move,
};
