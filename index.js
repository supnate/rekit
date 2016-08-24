const path = require('path');
const exec = require('child_process').exec;
const shell = require('shelljs');
const _ = require('lodash');

const prjName = process.argv[2];
if (!prjName) {
  console.error('Error: please specify the project name.');
  process.exit(1);
}

const pkgJson = {
  name: prjName,
  version: '0.0.1',
  description: 'My awesome project.',
  scripts: {
    start: 'node ./tools/server.js',
    build: 'node ./tools/build.js',
    'build:test': 'node ./tools/build_test_server.js',
    'add:feature': 'node ./tools/add_feature.js',
    'add:action': 'node ./tools/add_action.js',
    'add:async-action': 'node ./tools/add_async_action.js',
    'add:page': 'node ./tools/add_page.js',
    'add:component': 'node ./tools/add_component.js',
    'rm:feature': 'node ./tools/rm_feature.js',
    'rm:action': 'node ./tools/rm_action.js',
    'rm:async-action': 'node ./tools/rm_async_action.js',
    'rm:page': 'node ./tools/rm_page.js',
    'rm:component': 'node ./tools/rm_component.js',
  },
  babel: {
    presets: [
      'es2015',
      'react',
      'babel-preset-stage-0',
    ],
    plugins: [
      'lodash',
    ],
  },
  webpackDevServerPort: 6076,
  buildTestServerPort: 6077,
};

console.log('Welcome to rekit, now creating your project...');

const prjPath = path.join(process.cwd(), prjName);
if (shell.test('-e', prjPath)) {
  console.error('Error: target folder has been existed: ', prjName);
  process.exit(1);
}
shell.mkdir(prjPath);

console.log('Copying files...');
shell.cp('-R', path.join(__dirname, './src'), prjPath);
shell.cp('-R', path.join(__dirname, './tools'), prjPath);

shell.rm('-rf', path.join(prjPath, 'src/_tmp')); // in case _tmp folder is copied.

[
  '.eslintrc',
  'gitignore.tpl',
  'webpack.dev.config.js',
  'webpack.dist.config.js',
  'webpack.dll.config.js',
].forEach(file => {
  shell.cp(path.join(__dirname, file), prjPath);
});

shell.mv(path.join(prjPath, 'gitignore.tpl'), path.join(prjPath, '.gitignore'));

const prjConfig = {
  dependencies: [
    'enzyme',
    'lodash',
    'memobind',
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux',
    'redux-logger',
    'redux-thunk',
    'reselect',
    'style-loader',
  ],
  devDependencies: [
    'babel-core',
    'babel-eslint',
    'babel-loader',
    'babel-plugin-lodash',
    'babel-polyfill',
    'babel-preset-es2015',
    'babel-preset-react',
    'babel-preset-stage-0',
    'babel-register',
    'css-loader',
    'eslint',
    'eslint-config-airbnb',
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
    'estraverse',
    'estraverse-fb',
    'file-loader',
    'less',
    'less-loader',
    'lodash-webpack-plugin',
    'react-hot-loader',
    'shelljs',
    'url-loader',
    'webpack',
    'webpack-dashboard',
    'webpack-dev-server',
  ],
};

const pkgVersions = {};

console.log('Getting dependencies versions...');
const promises = [].concat(prjConfig.dependencies, prjConfig.devDependencies).map(dep => new Promise((resolve, reject) => {
  exec(`npm show ${dep} version`, (err, stdout) => {
    const version = stdout.replace(/[\r\n]/g, '');
    pkgVersions[dep] = `^${version}`;
    resolve();
  });
}));

Promise.all(promises).then(() => {
  pkgJson.dependencies = _.pick(pkgVersions, prjConfig.dependencies);
  pkgJson.devDependencies = _.pick(pkgVersions, prjConfig.devDependencies);
  shell.ShellString(JSON.stringify(pkgJson, null, '  ')).to(path.join(prjPath, 'package.json'));
  console.log('Project creation success!');
  console.log(`To run the project, please go to the project folder "${prjName}" and:`);
  console.log('  1. run "npm install" to install dependencies.');
  console.log('  2. run "npm start" to start the dev server.');
  console.log('Enjoy!');
}).catch(
  /* istanbul ignore next */
  err => console.log(err.stack || err)
);
