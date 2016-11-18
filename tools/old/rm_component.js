'use strict';

const lib = require('./lib');

const args = lib.args.parse1();
const feature = args.feature;
const component = args.component;

lib.component.remove(feature, component);
lib.style.remove(feature, component);
lib.test.remove(feature, component);

lib.vio.flush();

console.log(lib.colors.green(`✨  Remove component success:  ${feature}/${component}`));
