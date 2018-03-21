'use strict';

const fs = require('fs');
const path = require('path');
const rekitCore = require('rekit-core');
const spawn = require('child_process').spawn;

function runBuild(io) {
  const prjRoot = rekitCore.utils.getProjectRoot();
  return new Promise((resolve) => {
    const isCra = fs.existsSync(path.join(prjRoot, 'scripts/build.js'));

    const child = spawn('node',
      [
        isCra ? `${prjRoot}/scripts/build.js` : `${prjRoot}/tools/build.js`
      ],
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
        type: 'build',
        output: arr,
      });
    };
    child.stdout.on('data', handleOutput);
    child.stderr.on('data', handleOutput);

    child.on('close', () => {
      io.emit('build-finished', {});
      resolve();
    });
  });
}

module.exports = runBuild;
