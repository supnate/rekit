
const shell = require('shelljs');
const helpers = require('./helpers');
const inout = require('./inout');
const template = require('./template');
const entry = require('./entry');

module.exports = {
  add(feature, name, args) {
    // args:
    //  { content: string, template: string, templatePath: string, context: object }

    // create component from template
    args = args || {};
    template.create(helpers.mapName(feature, name) + '.js', {
      content: args.content,
      template: args.template || helpers.readTemplate('Component2.js'),
      context: Object.assign({ feature, component: name, depth: 2 }, args.context || {}),
      templateOptions: args.templateOptions || {},
    });

    // add to index.js
    entry.add(feature, name);
  },

  remove(feature, name) {
    inout.del(helpers.mapName(feature, name) + '.js');
    entry.remove(feature, name);
  },

  move(source, dest) {
    // 1. Move the File.js
    // 2. Update the path in index.js
    // 3. Search all reference in the project features project.

    const content = shell.cat(helpers.mapName(source.feature, source.name) + '.js');
    this.remove(source.feature, source.name);
    this.add(dest.feature, dest.name, { content });
  },
};
