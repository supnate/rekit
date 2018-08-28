process.env.NODE_ENV = 'development';

const fs = require('fs');
const crypto = require('crypto');
const webpack = require('webpack');
const paths = require('../config/paths');
const dllConfig = require('../config/dll.config');

const devConfigPath = '../config/webpack.config.dev';
const prodConfigPath = '../config/webpack.config.prod';

const isDev = () => process.env.NODE_ENV === 'development';

function getDllName() {
  const rsVersion = require(paths.appPackageJson).version;
  if (isDev()) {
    const nameVersions = dllConfig['dev-dll']
      .map(pkgName => {
        const pkg = require(`${pkgName}/package.json`);
        return `${pkg.name}_${pkg.version}`;
      })
      .join('-');

    const dllHash = crypto
      .createHash('md5')
      .update(nameVersions)
      .digest('hex');
    const dllName = `dev_dll_${dllHash}`;
    return dllName;
  }
  return `rsdll_${rsVersion.replace(/\./g, '_')}`;
}

function buildDll() {
  const dllName = getDllName();
  const dllManifestPath = paths.resolveApp('.tmp/dev-vendors-manifest.json');

  delete require.cache[dllManifestPath];

  let wpConfig;
  if (isDev()) {
    if (fs.existsSync(dllManifestPath) && require(dllManifestPath).name === dllName) {
      console.log('Dev dll is up to date, no need to build.');
      return Promise.resolve();
    }
    console.log('Dev vendors have changed, rebuilding dll...');
    wpConfig = require(devConfigPath);
    wpConfig.entry = dllConfig['dev-dll'];
    wpConfig.output.path = paths.resolveApp('.tmp');
    wpConfig.output.filename = 'dev-dll.js';
  } else {
    console.log('Building dll...');
    wpConfig = require(prodConfigPath);
    wpConfig.entry = dllConfig['prod-dll'];
    wpConfig.output.filename = `static/js/${dllName}.js`;
  }
  wpConfig.output.library = dllName;
  wpConfig.plugins.push(
    new webpack.DllPlugin({
      path: dllManifestPath,
      name: dllName,
      context: paths.appSrc,
    })
  );

  console.time('Dll build success');

  return new Promise((resolve, reject) => {
    webpack(wpConfig, err => {
      if (err) {
        console.log('dll build failed:');
        console.log(err.stack || err);
        reject();
        return;
      }
      console.timeEnd('Dll build success');
      resolve();
    });
  });
}

module.exports = buildDll;
