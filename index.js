const path = require('path');
const exec = require('child_process').exec;
const shell = require('shelljs');
const _ = require('lodash');

const pkgJson = require('./package.json');
delete pkgJson.bin;
delete pkgJson.version;
delete pkgJson.name;
delete pkgJson.description;

const prjName = process.argv[2];
if (!prjName) {
  console.error('Error: please specify the project name.');
  process.exit(1);
}

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

[
  '.eslintrc',
  '.gitignore',
  'webpack.dev.config.js',
  'webpack.dist.config.js',
  'webpack.dll.config.js',
].forEach(file => {
  shell.cp(path.join(__dirname, file), prjPath);
});

const prjConfig = {
  dependencies: [
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
    'superagent',
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
    'webpack-bundle-size-analyzer',
    'webpack-dev-server',
  ],
};

const pkgVersions = {};

console.log('Getting dependencies versions...');
const promises = [].concat(prjConfig.dependencies, prjConfig.devDependencies).map(dep => new Promise((resolve, reject) => {
  exec(`npm show ${dep} version`, (err, stdout, stderr) => {
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
}).catch(err => console.log(err.stack || err));





