/*
  There are two parts of testing: cli and app. They
  could not be run with one command because app uses
  webpack while cli is pure nodejs. The coverage report
  should be merged for two test suites. This is finished
  by cache_nyc_output.js and cp_back_nyc_output.js.

  Cache .nyc_output files to coverage folder.
*/
const path = require('path');
const shell = require('shelljs');

const cacheFolder = path.join(__dirname, '../coverage/.nyc_output');
if (!shell.test('-e', cacheFolder)) {
  shell.mkdir(cacheFolder);
}

shell.cp('-R', path.join(__dirname, '../.nyc_output/*'), cacheFolder);
