const fs = require('fs');
const { ast, paths, vio, app, files } = rekit.core;

function getRoutes() {
  const routesPath = paths.map('routes.json');
  delete require.cache[routesPath];
  const routes = require(routesPath);
  return routes.map(r => {
    if (r.route || typeof r === 'string') {
      const route = r.route || r;
      const match = /^(\S+) +(\/\S*) *=> *(\S+)$/.exec(route);
      const target = match[3].replace(/^\.\//, '').replace(/\/rest$/, '');
      return {
        method: match[1],
        path: match[2],
        target,
        security: r.security || '',
      };
    } else if (r.path && r.handler) {
      const route = r.path;
      const match = /^(\S+) +(\/\S*)$/.exec(route);
      const target = r.handler.replace(/^require:\.\/|$\S+/, '');
      return {
        method: match[1],
        path: match[2],
        target,
        security: r.security || '',
      };
    }
    return {
      method: 'unknown',
      path: 'unknown',
      target: 'unknown',
      security: '',
    }
  });
}

function getProjectData() {
  const prjData = files.readDir(paths.map('src'));

  const file = 'routes.json';
  prjData.elementById[file] = {
    id: file,
    name: file,
    type: 'file',
    ext: 'json',
    size: fs.statSync(paths.map(file)).size,
  };
  prjData.routes = getRoutes();
  return prjData;
}

module.exports = { getProjectData };
