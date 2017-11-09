'use strict';

const rekitCore = require('rekit-core');

function execCmd(req) {
  const args = req.body;
  rekitCore.handleCommand(args);
  const logs = rekitCore.vio.flush();
  return { logs };
}

module.exports = execCmd;
