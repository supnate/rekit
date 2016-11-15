
const helpers = require('./helpers');
const inout = require('./inout');
const template = require('./template');

module.exports = {
  add(feature, name, args) {
    args = args || {};
    template.create(helpers.getTestFile(feature, name), {
      content: args.content,
      template: args.template || helpers.readTemplate('Component.test.js'),
      context: Object.assign({ feature, component: name }, args.context || {}),
      templateOptions: args.templateOptions || {},
    });
  },

  remove(feature, name) {
    inout.del(helpers.getTestFile(feature, name));
  },

  mv(source, dest) {

  },
};
