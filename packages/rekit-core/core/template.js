'use strict';

/**
 * Template manager. A simple wrapper of lodash template for using vio internally.
 * @module
 **/

const _ = require('lodash');
const shell = require('shelljs');
const vio = require('./vio');

// Make sure it works in template
_.pascalCase = _.flow(_.camelCase, _.upperFirst);
_.upperSnakeCase = _.flow(_.snakeCase, _.toUpper);

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
  const tpl = args.template || shell.cat(args.templateFile);
  const compiled = _.template(tpl, args.templateOptions || {});
  const result = compiled(args.context || {});

  vio.save(targetPath, result);
}

module.exports = {
  generate,
};
