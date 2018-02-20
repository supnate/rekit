'use strict';

const fs = require('fs');
const rekitCore = require('rekit-core');

const utils = rekitCore.utils;

// function execCmd(req) {return;
//   const args = req.body;
//   console.log('exec cmd: ', args);
//   if (/file|folder/.test(args.type)) {
//     const filePath = utils.joinPath(utils.getProjectRoot(), args.path, args.name);
//     switch (args.commandName) {
//       case 'add': {
//         fs.writeFileSync(filePath, '');
//         return {
//           logs: [{
//             type: 'create-file',
//             file: filePath,
//           }],
//         };
//       }
//       default:
//         break;
//     }
//   } else {
//     rekitCore.handleCommand(args);
//     const logs = rekitCore.vio.flush();
//     return { logs };
//   }
// }

function execCmd(req, res) {
  try {
    const args = req.body;
    let logs = null;
    if (/file|folder/.test(args.type)) {
      const filePath = utils.joinPath(utils.getProjectRoot(), args.path, args.name);
      switch (args.commandName) {
        case 'add': {
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
