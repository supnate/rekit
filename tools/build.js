'use strict';
// Summary:
//  Build for production

const path = require('path');
const shell = require('shelljs');
const crypto = require('crypto');
const helpers = require('./lib/helpers');
const webpack = require('webpack');
const config = require('../webpack-config')('dist');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ArgumentParser = require('argparse').ArgumentParser;

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Whether to show bundle content as convenient interactive zoomable treemap',
});

parser.addArgument(['-p', '--profile'], {
  help: 'Whether to show profile of the bundle.',
  action: 'storeTrue',
});

const args = parser.parseArgs();

// Show profile of the build bundle
if (args.profile) {
  config.plugins.push(new BundleAnalyzerPlugin({
    // Can be `server`, `static` or `disabled`.
    // In `server` mode analyzer will start HTTP server to show bundle report.
    // In `static` mode single HTML file with bundle report will be generated.
    // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
    analyzerMode: 'static',
    // Path to bundle report file that will be generated in `static` mode.
    // Relative to bundles output directory.
    reportFilename: 'report.html',
    // Automatically open report in default browser
    openAnalyzer: true,
    // If `true`, Webpack Stats JSON file will be generated in bundles output directory
    generateStatsFile: false,
    // Options for `stats.toJson()` method.
    // For example you can exclude sources of your modules from stats file with `source: false` option.
    // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
    statsOptions: null
  }));
}

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

