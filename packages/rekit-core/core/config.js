const paths = require('./paths');

function getPkgJson(noCache) {
  const pkgJsonPath = paths.map('package.json');
  if (noCache) delete require.cache[pkgJsonPath];
  return require(pkgJsonPath);
}
// Load rekit configuration from package.json
module.exports = {
  css: 'less',
  getPkgJson,
};
