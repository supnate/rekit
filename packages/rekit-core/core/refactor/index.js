'use strict';

/**
 * Simple refactor for es6 code.
 * @module refactor
**/


const common = require('./common');
const identifier = require('./identifier');
const array = require('./array');
const importExport = require('./importExport');
const object = require('./object');
const style = require('./style');
const string = require('./string');
const cls = require('./cls');
const func = require('./func');
const lines = require('./lines');

module.exports = {
  // Common
  updateSourceCode: common.updateSourceCode,
  updateFile: common.updateFile,
  isLocalModule: common.isLocalModule,
  isSameModuleSource: common.isSameModuleSource,
  resolveModulePath: common.resolveModulePath,
  acceptFilePathForAst: common.acceptFilePathForAst,
  acceptFilePathForLines: common.acceptFilePathForLines,

  // Identifier
  renameIdentifier: identifier.renameIdentifier,

  // Class
  renameClassName: cls.renameClassName,

  // Function
  renameFunctionName: func.renameFunctionName,

  // Array
  addToArrayByNode: array.addToArrayByNode,
  removeFromArrayByNode: array.removeFromArrayByNode,
  addToArray: array.addToArray,
  removeFromArray: array.removeFromArray,

  // Import export
  addImportFrom: importExport.addImportFrom,
  addExportFrom: importExport.addExportFrom,

  renameImportSpecifier: importExport.renameImportSpecifier,
  renameImportAsSpecifier: importExport.renameImportAsSpecifier,
  renameExportSpecifier: importExport.renameExportSpecifier,

  removeImportSpecifier: importExport.removeImportSpecifier,
  removeImportBySource: importExport.removeImportBySource,

  renameModuleSource: importExport.renameModuleSource,

  // Object
  objExpToObj: object.objExpToObj,
  addObjectProperty: object.addObjectProperty,
  setObjectProperty: object.setObjectProperty,
  renameObjectProperty: object.renameObjectProperty,
  removeObjectProperty: object.removeObjectProperty,

  // Style
  renameCssClassName: style.renameCssClassName,
  addStyleImport: style.addStyleImport,
  removeStyleImport: style.removeStyleImport,
  renameStyleImport: style.renameStyleImport,

  // String
  renameStringLiteral: string.renameStringLiteral,
  replaceStringLiteral: string.replaceStringLiteral,

  // Lines
  lineIndex: lines.lineIndex,
  lastLineIndex: lines.lastLineIndex,
  removeLines: lines.removeLines,
};
