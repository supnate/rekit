'use strict';

const fs = require('fs');

function saveFile(filePath, content) {
  fs.writeFileSync(filePath, content);
}

module.exports = saveFile;
