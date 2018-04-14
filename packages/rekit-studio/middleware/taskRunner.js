// Run async tasks using socket.io to push to client.

'use strict';

const rekitCore = require('rekit-core');
const spawn = require('child_process').spawn;

function runTask(io, cmd, type, id) {
  const prjRoot = rekitCore.utils.getProjectRoot();
  const args = cmd.split(' ');
  return new Promise((resolve) => {
    const child = spawn(args[0],
      args.splice(1),
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
        type,
        id,
        output: arr,
      });
    };
    child.stdout.on('data', handleOutput);
    child.stderr.on('data', handleOutput);

    child.on('close', () => {
      io.emit(`${type}-finished`, {});
      resolve();
    });
  });
}

module.exports = runTask;
