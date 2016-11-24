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

// Bundle versioning using timestamp hash to prevent browser cache.
const timestamp = crypto
  .createHash('md5')
  .update(new Date().getTime().toString())
  .digest('hex')
  .substring(0, 10);

// Process index.html:
//   1. Remove dev vendors bundle
//   2. Add timestamp to main.bundle to prevent cache
const lines = helpers.getLines(path.join(__dirname, '../src/index.html'));
helpers.removeLines(lines, '/.tmp/dev-vendors.bundle.js');
let indexHtml = lines.join('\n');
indexHtml = indexHtml.replace('/static/main.bundle.js', `/static/main.bundle.${timestamp}.js`);
shell.ShellString(indexHtml).to(path.join(buildFolder, 'index.html'));

// Copy favicon
shell.cp(path.join(__dirname, '../src/favicon.png'), buildFolder);

// Webpack build
console.log('Building, it may take a few seconds...');
console.time('Done');
webpack(config, (err) => {
  if (err) console.log(err);
  else {
    // Add timestamp hash to bundle file name.
    shell.mv(path.join(buildFolder, './static/main.bundle.js'), path.join(buildFolder, `/static/main.bundle.${timestamp}.js`));
    console.timeEnd('Done');
  }
});

