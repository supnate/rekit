'use strict';

const fs = require('fs');
const path = require('path');
const rekitCore = require('rekit-core');
const spawn = require('child_process').spawn;

function installPackage(io, name, type, version) {
  const prjRoot = rekitCore.utils.getProjectRoot();
  return new Promise((resolve) => {
    const child = spawn('yarn',
      ['add', 'loadash@latest'],
      {
        stdio: 'pipe',
        cwd: prjRoot
      }
    );
    child.stdout.pipe(process.stdout);
    const handleOutput = (data) => {
      // collect the data
      const text = data.toString('utf8').replace(/ /g, '&nbsp;').split('\n');

      const arr = [];
      text.forEach(t => arr.push(t));
      io.emit('output', {
        type: 'install-package',
        id: 'test-id',
        output: arr,
      });
    };
    child.stdout.on('data', handleOutput);
    child.stderr.on('data', handleOutput);

    child.on('close', () => {
      io.emit('install-package-finished', {});
      resolve();
    });
  });
}

module.exports = installPackage;
