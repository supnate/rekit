'use strict';

const shell = require('shelljs');
const helpers = require('./helpers');
const vio = require('./vio');
const template = require('./template');

module.exports = {
  add(feature, component, args) {
    // Create style file for a component
    args = args || {};
    template.create(helpers.mapName(feature, component) + '.less', Object.assign({}, args, {
      templateFile: args.templateFile || 'Component.less',
      context: Object.assign({ feature, component, depth: 2 }, args.context || {}),
    }));

    // add to style.less
    const targetPath = helpers.mapFile(feature, 'style.less');
    const lines = vio.getLines(targetPath);
    const i = helpers.lastLineIndex(lines, '@import ');
    lines.splice(i + 1, 0, `@import './${helpers.pascalCase(component)}.less';`);
    vio.save(targetPath, lines);
  },

  remove(feature, component) {
    // Remove style file of a component
    vio.del(helpers.mapName(feature, component) + '.less');

    const targetPath = helpers.mapFile(feature, 'style.less');
    const lines = vio.getLines(targetPath);
    helpers.removeLines(lines, `@import './${helpers.pascalCase(component)}.less';`);
    vio.save(targetPath, lines);
  },

  move(source, dest) {
    const content = shell.cat(helpers.mapName(source.feature, source.component) + '.less');
    this.remove(source.feature, source.component);
    this.add(dest.feature, dest.component, { content });
  },
};
