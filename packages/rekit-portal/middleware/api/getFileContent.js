'use strict';

const rekitCore = require('rekit-core');

const vio = rekitCore.vio;

function getFileContent(file) {
  return vio.getContent(file);
}

module.exports = getFileContent;

