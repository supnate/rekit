'use strict';

const fs = require('fs');
const path = require('path');
const rekitCore = require('rekit-core');
const spawn = require('child_process').spawn;

function runTest(io, testFile) {
  const prjRoot = rekitCore.utils.getProjectRoot();
  return new Promise((resolve) => {
    console.log('test file: ', testFile);
    // if (!testFile) return;
    const isCra = fs.existsSync(path.join(prjRoot, 'scripts/test.js'));
    const args = isCra ? [`${prjRoot}/scripts/test.js`] : [`${prjRoot}/tools/run_test.js`];

    if (isCra) testFile = testFile.replace('**/', '').replace(/\*/g, '.*');
    if (testFile) args.push(testFile);
    if (isCra) {
      args.push('--env=jsdom');
      args.push('--no-watch');
      args.push('--colors');
      if (!testFile) {
        args.push('--coverage');
      }
    }

    const child = spawn('node',
      args,
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
        type: 'test',
        output: arr,
      });
    };
    child.stdout.on('data', handleOutput);
    child.stderr.on('data', handleOutput);

    child.on('close', () => {
      io.emit('test-finished', {});
      resolve();
    });
  });
}

module.exports = runTest;
