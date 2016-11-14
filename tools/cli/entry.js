
// entry.js
//  Handle add/remove entry from index.js

const inout = require('./inout');

module.exports = {
  add(feature, name) {
    console.log('Add entry to index.js');
    targetPath = path.join(targetDir, 'index.js');
    lines = helpers.getLines(targetPath);
    i = helpers.lastLineIndex(lines, /^import /);
    lines.splice(i + 1, 0, `import ${componentName} from './${componentName}';`);
    i = helpers.lineIndex(lines, /^\};$/);
    lines.splice(i, 0, `  ${componentName},`);
    toSave(targetPath, lines);
  },

  remove(feature, name) {

  },
};
