'use strict';

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');

module.exports = {
  getProjectRoot() {
    return path.join(__dirname, '../../');
  },

  ensurePathDir(fullPath) {
    if (!shell.test('-e', path.dirname(fullPath))) {
      shell.mkdir('-p', path.dirname(fullPath));
    }
  },

  ensureDir(dir) {
    if (!shell.test('-e', dir)) {
      shell.mkdir('-p', dir);
    }
  },

  ensureFile(filePath, templateFile) {
    if (!shell.test('-e', filePath)) {
      if (templateFile) shell.cp(templateFile, filePath);
      else shell.ShellString('').to(filePath);
    }
  },

  pascalCase(name) {
    return _.upperFirst(_.camelCase(name));
  },

  readTemplate(name) {
    return shell.cat(path.join(__dirname, 'templates', name)).replace(/\r/g, '');
  },

  processTemplate(tpl, data) {
    const compiled = _.template(tpl);
    return compiled(data);
  },

  handleTemplate(name, context) {
    const compiled = _.template(this.readTemplate(name));
    return compiled(context);
  },

  getLines(filePath) {
    if (_.isArray(filePath)) return filePath;
    return shell.cat(filePath).split('\n').map(line => line.replace(/\r/g, ''));
  },

  removeLines(lines, str) {
    _.remove(lines, line => this.isStringMatch(line, str));
  },

  appendImportLine(lines, importLine) {
    const i = this.lastLineIndex(lines, /^import /);
    lines.splice(i + 1, 0, importLine);
  },

  removeImportLine(lines, modulePath) {
    this.removeLines(lines, new RegExp(`import \{ .+ \} from '${modulePath}';`));
  },

  removeNamedImport(lines, name) {
    this.removeLines(lines, `  ${name},`);
  },

  addNamedExport(lines, name) {
    const i = this.lastLineIndex(lines, /^\};/);
    lines.splice(i, 0, `  ${name},`);
  },

  removeNamedExport(lines, name) {
    console.log('removing named export: ', name);
    this.removeLines(lines, `  ${name},`);
  },

  addConstant(lines, name) {
    if (lines.length && !lines[lines.length - 1]) lines.pop();
    lines.push(`export const ${name} = '${name}';`);
    lines.push('');
  },

  removeConstant(lines, name) {
    this.removeLines(lines, `export const ${name} = '${name}';`);
  },

  isStringMatch(str, pattern) {
    if (typeof pattern === 'string') {
      return _.includes(str, pattern);
    } else if (_.isFunction(pattern)) {
      return pattern(str);
    }
    return pattern.test(str);
  },

  lineIndex(lines, str, fromIndex) {
    if (typeof str === 'string') {
      return _.findIndex(lines, l => l.indexOf(str) >= 0, fromIndex || 0);
    } else if (_.isFunction(str)) {
      return _.findIndex(lines, str);
    }
    return _.findIndex(lines, l => str.test(l), fromIndex || 0);
  },

  lastLineIndex(lines, str) {
    if (typeof str === 'string') {
      return _.findLastIndex(lines, l => l.indexOf(str) >= 0);
    } else if (_.isFunction(str)) {
      return _.findLastIndex(lines, str);
    }
    return _.findLastIndex(lines, l => str.test(l));
  },

  getToSave(filesToSave) {
    return function toSave(filePath, fileContent) {
      filesToSave.push({
        path: filePath,
        content: _.isArray(fileContent) ? fileContent.join('\n') : fileContent,
      });
    };
  },

  saveFiles(files) {
    console.log('Save files');
    files.forEach(file => {
      shell.ShellString(file.content).to(file.path);
    });
  },
};
