// Run async tasks using socket.io to push to client.

'use strict';

const rekitCore = require('rekit-core');
const spawn = require('child_process').spawn;
const _ = require('lodash');

function runTask(io, cmd, type, params) {
  console.log('running task: ', cmd);
  const prjRoot = rekitCore.utils.getProjectRoot();
  const args = cmd.split(' ');

  // const doOutput = (data) => {

  // }
  return new Promise((resolve) => {
    const child = spawn(args[0],
      args.splice(1),
      {
        stdio: 'pipe',
        cwd: prjRoot
      }
    );
    child.stdout.pipe(process.stdout);

    const arr = [];
    // Emit output at most every second
    const emitOutput = _.throttle(() => {
      if (arr.length > 0) io.emit('output', {
        type,
        id: params.id,
        params,
        output: arr,
      });
      arr.length = 0;
    }, 1000);
    const handleOutput = (data) => {
      // collect the data
      const text = data.toString('utf8').replace(/ /g, '&nbsp;').split('\n');
      arr.push.apply(arr, text);
      emitOutput();
    };
    child.stdout.on('data', handleOutput);
    child.stderr.on('data', handleOutput);

    child.on('close', () => {
      emitOutput.flush();
      io.emit('task-finished', { type, params });
      resolve();
    });
  });
}

module.exports = runTask;
