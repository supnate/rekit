const paths = require('./paths');

function getPkgJson(noCache) {
  const pkgJsonPath = paths.map('package.json');
  if (noCache) delete require.cache[pkgJsonPath];
  return require(pkgJsonPath);
}

function getRekitConfig(noCache) {
  return getPkgJson(noCache).rekit || null;
}
// Load rekit configuration from package.json
module.exports = {
  css: 'less',
  style: 'less',
  getPkgJson,
  getRekitConfig,
};
