const fs = require('fs-extra');
const paths = require('./paths');
const chokidar = require('chokidar');

let appType;
function getPkgJson(noCache, prjRoot) {
  const pkgJsonPath = prjRoot ? paths.join(prjRoot, 'package.json') : paths.map('package.json');
  if (!fs.existsSync(pkgJsonPath)) return null;
  if (noCache) delete require.cache[pkgJsonPath];
  return require(pkgJsonPath);
}

let rekitConfig = null;
let rekitConfigWatcher = null;
function getRekitConfig(noCache, prjRoot) {
  const rekitConfigFile = prjRoot ? paths.join(prjRoot, '.rekit') : paths.map('.rekit');
  const pkgJsonPath = prjRoot ? paths.join(prjRoot, 'package.json') : paths.map('package.json');
  if (!rekitConfigWatcher) {
    rekitConfigWatcher = chokidar.watch([rekitConfigFile, pkgJsonPath], { persistent: true });
    rekitConfigWatcher.on('all', () => {
      rekitConfig = null;
    });
  }

  if (rekitConfig) return rekitConfig;

  if (fs.existsSync(rekitConfigFile)) {
    rekitConfig = fs.readJsonSync(rekitConfigFile);
  } else {
    const pkgJson = getPkgJson(true, prjRoot);
    rekitConfig = pkgJson.rekit;
  }

  const c = rekitConfig || {};
  c.appType = appType || c.appType;
  return c;
}

function setAppType(_appType) {
  appType = _appType;
}

// Load rekit configuration from package.json
module.exports = {
  css: 'less',
  style: 'less',
  getPkgJson,
  getRekitConfig,
  setAppType,
};
