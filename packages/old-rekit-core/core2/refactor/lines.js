'use strict';

const _ = require('lodash');
const common = require('./common');

function isStringMatch(str, match) {
  if (_.isString(match)) {
    return _.includes(str, match);
  } else if (_.isFunction(match)) {
    return match(str);
  }
  return match.test(str);
}

function lineIndex(lines, match, fromMatch) {
  if (fromMatch && !_.isNumber(fromMatch)) {
    fromMatch = lineIndex(lines, fromMatch);
  }
  if (_.isString(match)) {
    // Match string
    return _.findIndex(lines, l => l.indexOf(match) >= 0, fromMatch || 0);
  } else if (_.isFunction(match)) {
    // Callback
    return _.findIndex(lines, match);
  }
// console.log('regular: ', _.findIndex(lines, l => match.test(l), fromMatch || 0));
  // Regular expression
  return _.findIndex(lines, l => match.test(l), fromMatch || 0);
}

function lastLineIndex(lines, match) {
  if (_.isString(match)) {
    // String
    return _.findLastIndex(lines, l => l.indexOf(match) >= 0);
  } else if (_.isFunction(match)) {
    // Callback
    return _.findLastIndex(lines, match);
  }

  // Regular expression
  return _.findLastIndex(lines, l => match.test(l));
}

function removeLines(lines, str) {
  _.remove(lines, line => isStringMatch(line, str));
}

module.exports = {
  lineIndex,
  lastLineIndex,
  removeLines: common.acceptFilePathForLines(removeLines),
};
