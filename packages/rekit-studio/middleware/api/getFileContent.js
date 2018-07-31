'use strict';

const rekit = require('rekit-core');

const vio = rekit.core.vio;

function getFileContent(file) {
  return vio.getContent(file);
}

module.exports = getFileContent;
