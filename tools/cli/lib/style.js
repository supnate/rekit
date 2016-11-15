
const helpers = require('./helpers');
const inout = require('./inout');
const template = require('./template');

module.exports = {
  add(feature, name, args) {
    // create style from template
    args = args || {};
    template.create(helpers.mapName(feature, name) + '.less', {
      content: args.content,
      template: args.template || helpers.readTemplate('Component2.less'),
      context: Object.assign({ feature, component: name, depth: 2 }, args.context || {}),
      templateOptions: args.templateOptions || {},
      force: args.force,
    });

    // add to style.less
    const targetPath = helpers.mapFile(feature, 'style.less');
    const lines = inout.getLines(targetPath);
    const i = helpers.lastLineIndex(lines, '@import ');
    lines.splice(i + 1, 0, `@import './${helpers.pascalCase(name)}.less';`);
    inout.save(targetPath, lines);
  },

  remove(feature, name) {
    inout.del(helpers.mapName(feature, name) + '.less');

    const targetPath = helpers.mapFile(feature, 'style.less');
    const lines = inout.getLines(targetPath);
    helpers.removeLines(lines, `@import './${helpers.pascalCase(name)}.less';`);
    inout.save(targetPath, lines);
  },

  move(source, target) {

  },
};
