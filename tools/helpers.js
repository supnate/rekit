const _ = require('lodash');
const shell = require('shelljs');

module.exports = {
  getLines(filePath) {
    return shell.cat(filePath).split('\n');
  },

  removeLines(lines, str) {
    _.remove(lines, line => line.includes(str));
  },

  lineIndex(lines, str) {
    if (typeof str === 'string') {
      return _.findIndex(lines, l => l.indexOf(str) >= 0);
    }
    return _.findIndex(lines, l => str.test(l));
  },

  lastLineIndex(lines, str) {
    if (typeof str === 'string') {
      return _.findLastIndex(lines, l => l.indexOf(str) >= 0);
    }
    return _.findLastIndex(lines, l => str.test(l));
  },

  processTemplate(tpl, data) {
    const compiled = _.template(tpl);
    return compiled(data);
  },

  getToSave(filesToSave) {
    return function toSave(filePath, fileContent) {
      filesToSave.push({
        path: filePath,
        content: _.isArray(fileContent) ? fileContent.join('\n') : fileContent,
      });
    };
  },

  saveFiles(files) {
    console.log('Save files');
    files.forEach(file => {
      shell.ShellString(file.content).to(file.path);
    });
  },
};
