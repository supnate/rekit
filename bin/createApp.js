'use strict';

// Summary:
//  Create a new project.

const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const rekitPkgJson = require('../package.json');

function createApp(args) {
  const prjName = args.name;
  if (!prjName) {
    console.log('Error: please specify the project name.');
    process.exit(1);
  }

  // The created project dir
  const prjPath = path.join(process.cwd(), prjName);
  if (fs.existsSync(prjPath)) {
    console.log(`Error: target folder already exists: ${prjPath}`);
    process.exit(1);
  }
  console.log('Welcome to Rekit, now creating your project...');
  fs.mkdirSync(prjPath);

  // Rekit CLI itself.
  const rekitRoot = path.join(__dirname, '..');

  // The package.json for the new created project
  const pkgJson = {
    name: prjName,
    version: '0.0.1',
    private: true,
    description: `${prjName} created by Rekit.`,
    keywords: ['rekit'],
    babel: rekitPkgJson.babel,
    nyc: rekitPkgJson.nyc,
    rekit: {
      version: rekitPkgJson.version,
      devPort: 6075,
      portalPort: 6076,
      buildPort: 6077,
      plugins: [],
      css: args.sass ? 'sass' : 'less',
    },
  };

  // Remove unecessary scripts
  pkgJson.scripts = {
    start: 'node ./tools/server.js',
    build: 'node ./tools/build.js',
    test: 'node ./tools/run_test.js',
  };

  // Copy all necessary files
  console.log('Copying files...');
  function filterCssFiles(p) {
    if (
      (/\.less$/.test(p) && args.sass)
      || (/\.scss$/.test(p) && !args.sass)
    ) return false;

    return true;
  }
  utils.copyFolderRecursiveSync(path.join(rekitRoot, 'src'), prjPath, filterCssFiles);
  utils.copyFolderRecursiveSync(path.join(rekitRoot, 'tools'), prjPath);
  fs.mkdirSync(path.join(prjPath, 'tests'));
  utils.copyFolderRecursiveSync(path.join(rekitRoot, 'tests/features'), path.join(prjPath, 'tests'));

  [
    '.eslintrc',
    'gitignore.tpl',
    'webpack-config.js',
    'webpack.test.config.js',
  ].forEach((file) => {
    utils.copyFileSync(path.join(rekitRoot, file), prjPath);
  });

  [
    'tests/.eslintrc',
    'tests/before-all.js',
    'tests/index.test.js',
    'tests/Root.test.js',
    'tests/jsdom-setup.js',
  ].forEach((file) => {
    utils.copyFileSync(path.join(rekitRoot, file), path.join(prjPath, 'tests'));
  });

  // Create gitignore
  fs.rename(path.join(prjPath, 'gitignore.tpl'), path.join(prjPath, '.gitignore'));

  // If sass, change webpack configs.
  if (args.sass) {
    const configPath = path.join(prjPath, 'webpack-config.js');
    let text = fs.readFileSync(configPath).toString();
    text = text.replace(/\.less/g, '.scss').replace('less-loader', 'sass-loader');
    fs.writeFileSync(configPath, text);
  }

  console.log('Getting the latest dependencies versions...');
  function done(deps) {
    pkgJson.dependencies = deps.dependencies;
    pkgJson.devDependencies = deps.devDependencies;

    if (args.sass) {
      // If using sass
      delete pkgJson.devDependencies['less']; // eslint-disable-line
      delete pkgJson.devDependencies['less-loader'];
    } else {
      // If using less
      delete pkgJson.devDependencies['node-sass'];
      delete pkgJson.devDependencies['sass-loader'];
    }

    fs.writeFileSync(path.join(prjPath, 'package.json'), JSON.stringify(pkgJson, null, '  '));
    console.log('Project creation success!');
    console.log(`To run the project, please go to the project folder "${prjName}" and:`);
    console.log('  1. run "npm install" to install dependencies.');
    console.log('  2. run "npm start" to start the dev server.');
    console.log('Enjoy!');
    console.log('');
  }

  utils.requestDeps().then(done).catch((err) => {
    console.log('Failed to get dependencies. The project was not created. Please check and retry.');
    console.log(err);
    utils.deleteFolderRecursive(prjPath);
    process.exit(1);
  });
}

module.exports = createApp;
