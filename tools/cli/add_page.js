'use strict';
// Summary:
//  Add a page
// Usage:
//  node add_page.js featureName/pageName [urlPath]
// Example:
//  node add_page.js employee/ListView [list]
const lib = require('./lib');

const args = lib.args.parse1();
const feature = args.feature;
const page = args.component;
const urlPath = args.urlPath;
// const program = require('commander');
// const inout = require('./lib/inout');
// const component = require('./lib/component');
// const style = require('./lib/style');
// const route = require('./lib/route');
// const test = require('./lib/test');
// const colors = require('colors/safe');

// let feature;
// let name;
// let urlPath;

// program
//   .arguments('<page> [urlPath]')
//   .action((arg1, arg2) => {
//     const arr = arg1.split('/');
//     feature = arr[0];
//     name = arr[1];
//     urlPath = arg2;
//   })
//   .parse(process.argv);

lib.component.add(feature, page, { templateFile: 'Page.js' });
lib.route.add(feature, page, urlPath);
lib.style.add(feature, page);
lib.test.add(feature, page, { templateFile: 'Page.test.js' });

lib.inout.flush();

console.log(lib.colors.green(`✨  Add page success:  ${feature}/${page}`));
