
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const helpers = require('./helpers');
const inout = require('./inout');

const entry = require('./entry');
const style = require('./style');

module.exports = {
  add(feature, name, args) {
    // args:
    //  { content: string, template: string, templatePath: string, context: object }

    // create component from template
    helpers.createFromTemplate(feature, name, 'Component.js');

    // add to index.js
    entry.add(feature, name);

    // create style file
    style.add(feature, name);
  },

  remove(feature, name) {

  },

  move(source, dest) {
    // 1. Move the file.js and file.less
    // 2. Update the path in index.js
    // 3. Update the path in style.less
    // 4. Search all reference in the project features project.

    const content = shell.cat(helpers.mapName(source.feature, source.name) + '.js');
    this.remove(source.feature, source.name);
    this.add(dest.feature, dest.name, { content });
    style.move(source, dest);
  },
};
