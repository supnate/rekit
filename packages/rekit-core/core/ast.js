const _ = require('lodash');
const babylon = require('babylon');
const vio = require('../core/vio');

let cache = [];
const failedToParse = {};

function getAst(filePath) {
  // Todo: make src/libs configurable
  if (_.startsWith(filePath, 'src/libs/')) return null; // ignore libs folder to parse
  if (!cache[filePath]) {
    const code = vio.getContent(filePath);
    try {
      const ast = babylon.parse(code, {
        // parse in strict mode and allow module declarations
        sourceType: 'module',
        plugins: [
          'jsx',
          'flow',
          'doExpressions',
          'objectRestSpread',
          'decorators',
          'classProperties',
          'exportExtensions',
          'asyncGenerators',
          'functionBind',
          'functionSent',
          'dynamicImport',
        ],
      });
      if (!ast) {
        failedToParse[filePath] = true;
        return null;
        // utils.fatalError(`Error: failed to parse ${filePath}, please check syntax.`);
      }
      delete failedToParse[filePath];
      cache[filePath] = ast;
      ast._filePath = filePath;
    } catch (e) {
      failedToParse[filePath] = true;
      return null;
    }
  }
  return cache[filePath];
}

// function assertAst(ast, filePath) {
//   if (!ast) {
//     reset(); // eslint-disable-line
//     utils.fatalError(`Failed to parse ${filePath}, please fix and try again.`);
//   }
// }

function getFilesFailedToParse() {
  return failedToParse;
}

function clearCache(filePath) {
  if (filePath) delete cache[filePath];
  else cache = {};
}

module.exports = {
  getAst,
  clearCache,
  getFilesFailedToParse,
};
