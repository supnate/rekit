'use strict';
// Summary:
//  Build for production

const path = require('path');
const shell = require('shelljs');
const crypto = require('crypto');
// const utils = require('./lib/utils');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ArgumentParser = require('argparse').ArgumentParser;

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Whether to show bundle content as convenient interactive zoomable treemap',
});

parser.addArgument(['--profile', '-p'], {
  help: 'Whether to show profile of the bundle.',
  action: 'storeTrue',
});

parser.addArgument(['--dist'], {
  help: 'Whether it is a dist build.',
  action: 'storeTrue',
});

parser.addArgument(['--demo'], {
  help: 'Whether it is a demo build.',
  action: 'storeTrue',
});

const args = parser.parseArgs();
const config = require('../webpack-config')(args.demo ? 'demo' : 'dist'); // eslint-disable-line
console.log('build args: ', args);
// Show profile of the build bundle
// https://github.com/th0r/webpack-bundle-analyzer
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
    openAnalyzer: false,
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
//   2. Add timestamp to main to prevent cache
let lines = shell.cat(path.join(__dirname, '../src/index.html')).split(/\r?\n/);
lines = lines.filter(line => line.indexOf('/.tmp/dev-vendors.js') < 0); // remove dev-vendors
let indexHtml = lines.join('\n');
indexHtml = indexHtml.replace('<img src="/src/images/logo_small.png" />', '<img src="/static/logo_small.png" />');
if (!args.dist) indexHtml = indexHtml.replace('/static/main.js', `/static/main.${timestamp}.js`);

shell.ShellString(indexHtml).to(path.join(buildFolder, 'index.html'));

// Copy favicon
shell.cp(path.join(__dirname, '../src/favicon.png'), buildFolder);
// Copy rekit logo
shell.cp(path.join(__dirname, '../src/images/logo_small.png'), path.join(buildFolder, 'static'));

// Webpack build
console.log('Building, it may take a few seconds...');
console.time('Done');
const compiler = webpack(config);

let lastPercentage = 0;
compiler.apply(new ProgressPlugin((percentage, msg) => {
  percentage = Math.round(percentage * 10000) / 100;
  if (/building modules/.test(msg) && percentage - lastPercentage < 8) {
    return;
  }
  lastPercentage = percentage;
  console.log(percentage + '%', msg);
}));

compiler.run((err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  console.log(stats.toString({
    colors: true,
  }));

  // Add timestamp hash to bundle file name.
  if (!stats.hasErrors() && !args.dist) shell.mv(path.join(buildFolder, './static/main.js'), path.join(buildFolder, `/static/main.${timestamp}.js`));

  // if build for npm, copy build folder to dist folder
  if (args.dist) {
    console.log('copy build folder to dist build.');
    const distFolder = path.join(__dirname, '../dist');
    shell.rm('-rf', distFolder);
    shell.cp('-r', buildFolder, distFolder);
  }
  console.timeEnd('Done');
});
