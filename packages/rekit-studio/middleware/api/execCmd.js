'use strict';

const fs = require('fs');
const shell = require('shelljs');
const rekitCore = require('rekit-core');

const utils = rekitCore.utils;

function execCmd(req, res) {
  try {
    const args = req.body;
    let logs = null;
    if (/file|folder/.test(args.type)) {
      switch (args.commandName) {
        case 'add': {
          const filePath = utils.joinPath(utils.getProjectRoot(), args.path, args.name);
          if (args.type === 'file') {
            fs.writeFileSync(filePath, '');
            logs = [{
              type: 'create-file',
              file: filePath,
            }];
          } else if (args.type === 'folder') {
            fs.mkdirSync(filePath);
            logs = [{
              type: 'create-dir',
              file: filePath,
            }];
          }
          break;
        }
        case 'remove': {
          const filePath = utils.joinPath(utils.getProjectRoot(), args.path);
          shell.rm('-rf', filePath);
          logs = [{
            type: 'del-file',
            file: filePath,
          }];
        }
        default:
          break;
      }
    } else {
      rekitCore.handleCommand(args);
      logs = rekitCore.vio.flush();
      rekitCore.vio.reset();
    }
    res.write(JSON.stringify({
      args,
      logs,
    }));
    res.end();
  } catch (e) {
    res.statusCode = 500;
    res.write(e.toString());
    res.end();
  }
}

module.exports = execCmd;
