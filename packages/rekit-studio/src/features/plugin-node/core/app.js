const { ast, paths, vio, app } = rekit.core;

console.log(paths.getProjectRoot());
function getProjectData() {
  return app.readDir(paths.map('src'));
}

module.exports = { getProjectData };
