'use strict';

const core = require('rekit-core');
const projectData = require('rekit-core/core/refactor/projectData');
// const refactor = core.refactor;
// const vio = core.vio;
// const utils = core.utils;

// utils.setProjectRoot('/Users/i305656/workspace/rekit-portal');

console.time('timer');
// const file = utils.mapFeatureFile('home', 'Navigator.js');
// const deps = refactor.getDeps(file);
// console.log(file, deps);
console.log(projectData.getFeatures());
console.timeEnd('timer');
