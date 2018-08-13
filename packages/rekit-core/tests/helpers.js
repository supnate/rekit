/* eslint strict: 0, no-unused-expressions: 0 */
'use strict';

const path = require('path');
const expect = require('chai').expect;
const shell = require('shelljs');
const _ = require('lodash');
// const utils = require('../core/utils');
const paths = require('../core/paths');
const vio = require('../core/vio');
const logger = require('../core/logger');

// const TEST_FEATURE_NAME = 'a-feature';
// const TEST_FEATURE_NAME_2 = 'another-feature';

// For testing, use a fake project root
// paths.setProjectRoot(path.join(__dirname, './test-prj'));
// logger.setSilent(true);

// function mapFile(file) {
//   return path.join(__dirname, '../../src', file);
// }

// function mapFeatureFile(file) {
//   return path.join(__dirname, '../../src/features', TEST_FEATURE_NAME, file);
// }

// function mapTestFile(file) {
//   return path.join(__dirname, '../../tests', file);
// }

// function mapFeatureTestFile(file) {
//   return path.join(__dirname, '../../tests/features', TEST_FEATURE_NAME, file);
// }

function pureExec(cmd) {
  return shell.exec(cmd, { silent: true });
}

function exec(cmd) {
  expect(pureExec(cmd).code).to.equal(0);
}

function pureExecTool(script, args) {
  return shell.exec(`"${process.execPath}" "${path.join(__dirname, '../../tools/cli', script)}" ${args || ''}`, {
    silent: true,
  });
}

function execTool(script, args) {
  expect(pureExecTool(script, args).code).to.equal(0);
}

function expectError(cmd) {
  expect(pureExec(cmd).code).to.equal(1);
}

function expectFile(file) {
  expect(file).to.satisfy(vio.fileExists);
}

function expectFiles(files) {
  files.forEach(expectFile);
}

function expectNoFile(file) {
  expect(file).to.satisfy(vio.fileNotExists);
}

function expectNoFiles(files) {
  files.forEach(expectNoFile);
}

function getLines(file) {
  return vio.getLines(file);
}

function expectLine(file, line) {
  const lines = getLines(file);
  expect(line).to.be.oneOf(lines);
}

function expectLines(file, lines) {
  lines.forEach(line => expectLine(file, line));
}

function expectNoLine(file, line) {
  const lines = getLines(file);
  expect(_.find(lines, l => l.indexOf(line) >= 0)).to.not.exist;
}

function expectNoLines(file, lines) {
  lines.forEach(line => expectNoLine(file, line));
}

function escapeRegExp(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = {
  exec,
  execTool,
  pureExecTool,
  pureExec,
  expectError,
  expectFile,
  expectFiles,
  expectNoFile,
  expectNoFiles,
  getLines,
  expectLine,
  expectNoLine,
  expectLines,
  expectNoLines,
  // TEST_FEATURE_NAME,
  // TEST_FEATURE_NAME_2,
  escapeRegExp,
};
