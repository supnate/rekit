'use strict';

const rekitCore = require('rekit-core');
const spawn = require('child_process').spawn;

function runBuild(io, testFile) {
  const prjRoot = rekitCore.utils.getProjectRoot();
  return new Promise((resolve) => {
    console.log('test file: ', testFile);
    // if (!testFile) return;
    const args = [`${prjRoot}/tools/run_test.js`];
    if (testFile) args.push(testFile);
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

module.exports = runBuild;
