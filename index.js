const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const fetch = require('isomorphic-fetch');
const rekitPkgJson = require('./package.json');

const prjName = process.argv[2];
if (!prjName) {
  console.error('Error: please specify the project name.');
  process.exit(1);
}

const pkgJson = {
  name: prjName,
  version: '0.0.1',
  description: 'My awesome project.',
  scripts: rekitPkgJson.scripts,
  babel: rekitPkgJson.babel,
  nyc: rekitPkgJson.nyc,
  webpackDevServerPort: 6076,
  buildTestServerPort: 6077,
};

delete pkgJson.scripts.codecov;
delete pkgJson.scripts['test:rekit'];

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
shell.cp('-R', path.join(__dirname, './test'), prjPath);

shell.rm(path.join(prjPath, 'test/cli/rekit.js'));
shell.rm('-rf', path.join(prjPath, 'src/.tmp')); // in case _tmp folder is copied.

[
  '.eslintrc',
  'gitignore.tpl',
  'webpack.dev.config.js',
  'webpack.dist.config.js',
  'webpack.dll.config.js',
  'webpack.test.config.js',
].forEach(file => {
  shell.cp(path.join(__dirname, file), prjPath);
});

shell.mv(path.join(prjPath, 'gitignore.tpl'), path.join(prjPath, '.gitignore'));

const prjConfig = {
  dependencies: _.keys(rekitPkgJson.dependencies),
  devDependencies: _.keys(rekitPkgJson.devDependencies),
};

console.log('Getting dependencies versions...');
function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}

function json(response) {
  return response.json();
}

function done(pkgVersions) {
  pkgJson.dependencies = _.pick(pkgVersions, prjConfig.dependencies);
  pkgJson.devDependencies = _.pick(pkgVersions, prjConfig.devDependencies);
  shell.ShellString(JSON.stringify(pkgJson, null, '  ')).to(path.join(prjPath, 'package.json'));
  console.log('Project creation success!');
  console.log(`To run the project, please go to the project folder "${prjName}" and:`);
  console.log('  1. run "npm install" to install dependencies.');
  console.log('  2. run "npm start" to start the dev server.');
  console.log('Enjoy!');
}

fetch('http://raw.githubusercontent.com/supnate/rekit-deps/master/deps.1.x.json')
  .then(status)
  .then(json)
  .then(done)
  .catch(error => {
    console.log('Request failed', error);
    process.exit(1);
  });
