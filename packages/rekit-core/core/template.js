'use strict';

/**
 * Template manager. A simple wrapper of lodash template for using vio internally.
 * @module
**/

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const vio = require('./vio');
const utils = require('./utils');

// Make sure it works in template
_.pascalCase = _.flow(_.camelCase, _.upperFirst);
_.upperSnakeCase = _.flow(_.snakeCase, _.toUpper);

/**
 * Read a template content, if the file isn't absolute path, find it in rekit-core/templates folder. Otherwise read the file content.
 * If the file doesn't exist, throw fatal error and exit.
 *
 * @param {string} file - The path to the template file.
 * @alias module:template.readTemplate
**/
function readTemplate(file) {
  file = path.isAbsolute(file) ? file : utils.joinPath(__dirname, '../templates', file);
  if (!shell.test('-e', file) && !vio.fileExists(file)) {
    utils.fatalError('Template file does\'t exist: ', file);
  }
  return vio.getContent(file);
}

/**
 * Process the template file and save the result to virtual IO.
 * If the target file has existed, throw fatal error and exit.
 *
 * @param {string} targetPath - The path to save the result.
 * @param {Object} args - The path to save the result.
 * @param {string} args.template - The template string to process.
 * @param {string} args.templateFile - If no 'template' defined, read the template file to process. One of template and templateFile should be provided.
 * @param {Object} args.context - The context to process the template.
 * @alias module:template.generate
 *
 * @example
 * const template = require('rekit-core').template;
 *
 * const tpl = 'hello ${user}!';
 * template.generate('path/to/result.txt', { template: tpl, context: { user: 'Nate' } });
 *
 * // Result => create a file 'path/to/result.txt' which contains text: 'hello Nate!'
 * // NOTE the result is only in vio, you need to call vio.flush() to write to disk.
**/
function generate(targetPath, args) {
  if (!args.templateFile && !args.content && !args.template) {
    utils.fatalError('No template for generating' + targetPath + '.');
  }
  if (!args.force && (vio.fileExists(targetPath) || shell.test('-e', targetPath))) {
    utils.fatalError(`File already exists: ${targetPath}.`);
  }

  // What's content used for?????
  let content = args.content;
  if (!content) {
    const tpl = args.template || readTemplate(args.templateFile);
    const compiled = _.template(tpl, args.templateOptions || {});
    content = compiled(args.context || {});
  }
  const lines = content.split(/\r?\n/);
  vio.save(targetPath, lines);
}

module.exports = {
  readTemplate,
  generate,
};
