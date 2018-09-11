const fs = require('fs');
const { ast, paths, vio, app } = rekit.core;

console.log(paths.getProjectRoot());
function getProjectData() {
  const prjData = app.readDir(paths.map('src'));

  const file = 'routes.json';
  prjData.elementById[file] = {
    id: file,
    name: file,
    type: 'file',
    ext: 'json',
    size: fs.statSync(paths.map(file)).size,
  };
  return prjData;
}

module.exports = { getProjectData };
