const { vio, refactor } = rekit.core;

function add(folder) {
  if (vio.fileExists(folder)) throw new Error('Folder already exists: ' + folder);
  vio.mkdir(folder);
}

function move(source, dest) {
  
}

function remove(folder) {
  vio.del(folder);
}

module.exports = {
  add,
  remove,
  move,
};
