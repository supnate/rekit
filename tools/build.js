'use strict';
// Summary:
//  Build for production

const path = require('path');
const shell = require('shelljs');
const crypto = require('crypto');
const helpers = require('./lib/helpers');
const webpack = require('webpack');
const config = require('../webpack-config')('dist');

// Clean folder
const buildFolder = path.join(__dirname, '../build');
shell.rm('-rf', buildFolder);
shell.mkdir(buildFolder);
shell.mkdir(`${buildFolder}/static`);

// Bundle versioning to prevent browser cache.
const timestamp = crypto
  .createHash('md5')
  .update(new Date().getTime().toString())
  .digest('hex')
  .substring(0, 10);

// Process index.html
const lines = helpers.getLines(path.join(__dirname, '../src/index.html'));
helpers.removeLines(lines, '/.tmp/vendors.dll.js');
let indexHtml = lines.join('\n');
indexHtml = indexHtml.replace('/static/main.bundle.js', `/static/main.bundle.${timestamp}.js`);
shell.ShellString(indexHtml).to(path.join(buildFolder, 'index.html'));

// Webpack build
console.log('Building, it may take a few seconds...');
console.time('Done');
webpack(config, (err) => {
  if (err) console.log(err);
  else {
    shell.mv(path.join(buildFolder, './static/main.bundle.js'), path.join(buildFolder, `/static/main.bundle.${timestamp}.js`));
    console.timeEnd('Done');
  }
});

