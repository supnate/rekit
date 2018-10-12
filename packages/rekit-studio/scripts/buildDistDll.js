process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const paths = require('../config/paths');

function buildDll() {
  const dllName = 'rsdll';
  const dllManifestPath = paths.resolveApp('build/static/rsdll-manifest.json');

  console.log('Building dll...');

  let wpConfig = require('../config/webpack.config.prod');
  wpConfig = {
    ...wpConfig,
    output: { ...wpConfig.output },
    plugins: [...wpConfig.plugins],
  };
  wpConfig.output.filename = `static/js/${dllName}.js`;
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

buildDll();

module.exports = buildDll;
