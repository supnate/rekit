
// Summary
//  Add/remove entry from index.js for page and component.

const inout = require('./inout');
const helpers = require('./helpers');

module.exports = {
  add(feature, name) {
    const targetPath = helpers.mapFile(feature, 'index.js');
    const lines = inout.getLines(targetPath);
    const nameCases = helpers.nameCases(name);
    const i = helpers.lastLineIndex(lines, /^export .* from /);
    lines.splice(i + 1, 0, `export ${nameCases.PASCAL} from './${nameCases.PASCAL}';`);
    inout.save(targetPath, lines);
  },

  remove(feature, name) {
    const targetPath = helpers.mapFile(feature, 'index.js');
    const lines = inout.getLines(targetPath);
    const nameCases = helpers.nameCases(name);
    helpers.removeLines(lines, `export ${nameCases.PASCAL} from './${nameCases.PASCAL}';`);
    inout.save(targetPath, lines);
  },
};
