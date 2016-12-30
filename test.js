'use strict';

const core = require('rekit-core');
console.time('abc');
console.log(core.refactor.getFeatureStructure('home'));
console.timeEnd('abc');