'use strict';

const lib = require('./lib');

const args = lib.args.parse1();
const feature = args.feature;
const component = args.component;

lib.component.add(feature, component);
lib.style.add(feature, component);
lib.test.add(feature, component);

lib.inout.flush();

console.log(lib.colors.green(`✨  Add component success:  ${feature}/${component}`));
