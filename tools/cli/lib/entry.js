
// Summary
//  Add/remove entry from index.js for page and component.

const path = require('path');
const inout = require('./inout');
const helpers = require('./helpers');

module.exports = {
  add(feature, name) {
    console.log('Adding entry to index.js');
    const targetPath = helpers.mapFile(feature, 'index.js');
    const lines = inout.getLines(targetPath);
    const nameCases = helpers.nameCases(name);
    helpers.addImportLine(lines, `import ${nameCases.PASCAL} from './${nameCases.PASCAL}';`);
    helpers.addNamedExport(lines, name.PASCAL);
    inout.save(targetPath, lines);
  },

  remove(feature, name) {
    console.log('Removing entry from index.js');
    const targetPath = helpers.mapFile(feature, 'index.js');
    const lines = inout.getLines(targetPath);
    const nameCases = helpers.nameCases(name);
    helpers.removeImportLine(lines, `import ${nameCases.PASCAL} from './${nameCases.PASCAL}';`);
    helpers.removeNamedExport(lines, `  ${nameCases.PASCAL},`);
    inout.save(targetPath, lines);
  },
};
