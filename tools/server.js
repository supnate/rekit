const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('../webpack.dev.config');
const srcPath = path.join(__dirname, '../src');
const tmpPath = path.join(srcPath, './.tmp');
const manifestPath = path.join(tmpPath, 'vendors-manifest.json');

const PORT = require('../package.json').webpackDevServerPort;

function startDevServer() {
  devConfig.entry = {
    main: [
      'react-hot-loader/patch',
      `webpack-dev-server/client?http://localhost:${PORT}`,
      'webpack/hot/only-dev-server',
      './styles/index.less',
      './index',
    ],
  };
  devConfig.plugins.push(new webpack.DllReferencePlugin({
    context: srcPath,
    manifest: require(manifestPath),
  }));
  new WebpackDevServer(webpack(devConfig), {
    publicPath: devConfig.output.publicPath,
    contentBase: devConfig.devServer.contentBase,
    hot: true,
    noInfo: false,
    quiet: false,
    https: false,
    historyApiFallback: true,
  }).listen(PORT, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(`Listening at http://localhost:${PORT}`);
  });
}

// Check dll version to detect if it needs to be rebuilt
const dllConfig = require('../webpack.dll.config.js');
const nameVersions = dllConfig.entry.vendors.map(pkgName => {
  const pkgJson = require(path.join(pkgName.split('/')[0], 'package.json'));
  return `${pkgJson.name}_${pkgJson.version}`;
}).join('-');

const dllHash = require('crypto')
  .createHash('md5')
  .update(nameVersions)
  .digest('hex');
const dllName = `verndors_${dllHash}`;
console.log('dll name: ', dllName);
if (
  !shell.test('-e', manifestPath) // dll doesn't exist
  || require(manifestPath).name !== dllName // dll hash has changed
) {
  delete require.cache[manifestPath]; // force reload the new manifest
  console.log('vendors have changed, rebuilding dll...');
  // build dll
  dllConfig.output = {
    path: tmpPath,
    filename: 'vendors.dll.js',
    library: dllName,
  };

  // dllConfig.output.library = dllName;
  dllConfig.plugins.push(new webpack.DllPlugin({
    path: manifestPath,
    name: dllName,
    context: srcPath,
  }));

  webpack(dllConfig, (err) => {
    if (err) {
      console.log('dll build failed:');
      console.log(err.stack || err);
      return;
    }
    console.log('dll build success.');
    startDevServer();
  });
} else {
  console.log('vendors dll is up to date, no need to rebuild.');
  startDevServer();
}
