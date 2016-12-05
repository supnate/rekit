'use strict';

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const vio = require('./vio');
const helpers = require('./helpers');

// Make sure it works in template
_.pascalCase = _.flow(_.camelCase, _.upperFirst);
_.upperSnakeCase = _.flow(_.snakeCase, _.toUpper);

module.exports = {
  readTemplate(file) {
    file = path.isAbsolute(file) ? file : path.join(__dirname, '../templates', file);
    if (!shell.test('-e', file)) {
      helpers.fatalError('Template file does\'t exist: ', file);
    }
    return vio.getContent(file);
  },

  create(targetPath, args) {
    if (!args.templateFile && !args.content && !args.template) {
      helpers.fatalError('No template for generating' + targetPath + '.');
    }

    let content = args.content;
    if (!content) {
      const tpl = args.template || this.readTemplate(args.templateFile);
      const compiled = _.template(tpl, args.templateOptions || {});
      content = compiled(args.context || {});
    }
    if (!args.force && (vio.fileExists(targetPath) || shell.test('-e', targetPath))) {
      helpers.fatalError(`File already exists: ${targetPath}.`);
    }
    const lines = content.split(/\r?\n/);
    vio.save(targetPath, lines);
  }
};
