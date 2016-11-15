const shell = require('shelljs');
const _ = require('lodash');
const inout = require('./inout');
const helpers = require('./helpers');

_.pascalCase = _.flow(_.camelCase, _.upperFirst);

module.exports = {
  create(targetPath, args) {
    let content = args.content;
    if (!content) {
      const compiled = _.template(args.template, args.templateOptions || {});
      content = compiled(args.context);
    }
    if (!args.force && shell.test('-e', targetPath)) {
      helpers.fatalError(`File already exists: ${targetPath}.`);
    }
    inout.save(targetPath, content.split(/\r?\n/));
  }
};
