/*
  Copies .nyc_output files back to root .nyc_output folder.
*/
const path = require('path');
const shell = require('shelljs');

const cacheFolder = path.join(__dirname, '../coverage/.nyc_output');
if (!shell.test('-e', cacheFolder)) {
  return;
}

shell.cp('-R', path.join(__dirname, '../coverage/.nyc_output/*'), path.join(__dirname, '../.nyc_output'));
shell.rm('-rf', cacheFolder);
