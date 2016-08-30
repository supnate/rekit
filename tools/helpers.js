'use strict';

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const babel = require('babel-core');

const babelOptions = {
  presets: [
    'es2015',
    'react',
    'babel-preset-stage-0'
  ]
};
module.exports = {
  ensurePathDir(fullPath) {
    if (!shell.test('-e', path.dirname(fullPath))) {
      shell.mkdir('-p', path.dirname(fullPath));
    }
  },
  pascalCase(name) {
    return _.upperFirst(_.camelCase(name));
  },
  readTemplate(name) {
    return shell.cat(path.join(__dirname, 'templates', name)).replace(/\r/g, '');
  },

  getLines(filePath) {
    return shell.cat(filePath).split('\n').map(line => line.replace(/\r/g, ''));
  },

  removeLines(lines, str) {
    _.remove(lines, line => line.includes(str));
  },

  removeAstBlockNode(lines, node) {
    const loc = node.loc;
    let start = loc.start.line - 1;
    let len = (loc.end.line - loc.start.line) + 1;
    if (!lines[start - 1]) {
      // remove the empty line before the function
      start -= 1;
      len += 1;
    }
    lines.splice(start, len);
  },

  removeExportFunction(lines, funcName) {
    const code = lines.join('\n');
    const ast = babel.transform(code, babelOptions).ast.program;
    const funcElement = _.find(ast.body, { type: 'FunctionDeclaration', id: { name: funcName } });
    // istanbul ignore else
    if (funcElement) {
      this.removeAstBlockNode(lines, funcElement);
    }
  },

  removeSwitchCase(lines, caseName) {
    const code = lines.join('\n');
    const ast = babel.transform(code, babelOptions).ast.program;
    const funcElement = _.find(_.toArray(ast.body), { type: 'FunctionDeclaration', id: { name: 'reducer' } });
    const switchElement = _.find(funcElement.body.body, { type: 'SwitchStatement' });
    const caseElement = _.find(switchElement.cases, { test: { name: caseName } });
    // istanbul ignore else
    if (caseElement) {
      this.removeAstBlockNode(lines, caseElement);
    }
  },

  lineIndex(lines, str, fromIndex) {
    if (typeof str === 'string') {
      return _.findIndex(lines, l => l.indexOf(str) >= 0, fromIndex || 0);
    }
    return _.findIndex(lines, l => str.test(l), fromIndex || 0);
  },

  lastLineIndex(lines, str) {
    if (typeof str === 'string') {
      return _.findLastIndex(lines, l => l.indexOf(str) >= 0);
    }
    return _.findLastIndex(lines, l => str.test(l));
  },

  processTemplate(tpl, data) {
    const compiled = _.template(tpl);
    return compiled(data);
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
