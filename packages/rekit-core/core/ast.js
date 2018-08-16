const _ = require('lodash');
const babylon = require('babylon');
const vio = require('../core/vio');
const logger = require('../core/logger');

let cache = {};
const failedToParse = {};

function getAst(filePath, throwIfError) {
  // Todo: make src/libs configurable
  if (_.startsWith(filePath, 'src/libs/')) return null; // ignore libs folder to parse
  const checkAst = ast => {
    if (!ast && throwIfError) throw new Error(`Failed to parse ast, please check syntax: ${filePath}`);
  };

  if (!vio.fileExists(filePath)) {
    checkAst(null);
    return null;
  }

  const code = vio.getContent(filePath);

  if (!cache[filePath] || cache[filePath].code !== code) {
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

      checkAst(ast);

      if (!ast) {
        failedToParse[filePath] = true;
        logger.warn(`Failed to parse ast, please check syntax: ${filePath}`);
        return null;
      }
      delete failedToParse[filePath];
      cache[filePath] = { ast, code };
      ast._filePath = filePath;
    } catch (e) {
      checkAst(null);
      failedToParse[filePath] = true;
      logger.warn(`Failed to parse ast, please check syntax: ${filePath}`);
      return null;
    }
  }
  return cache[filePath].ast;
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
