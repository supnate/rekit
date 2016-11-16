/* eslint no-cond-assign: 0*/
'use strict';
// Summary:
//   Add a Rekit element.
//
// Example:
//   node add.js -c, --component <feature>/<name>
//   node add.js -p, --page <feature>/<name> -u, --url-path [url-path]
//   node add.js -a, --action <feature>/<name> -T, --action-type [action-type]
//   node add.js -A, --async-action <feature>/<name>
//   node add.js -t, --test <feature>/<name>

const lib = require('./lib');

console.time('✨  Done');
const program = lib.args.parse1();
let args;
if (args = program.component) {
  lib.component.add(args.feature, args.name);
  lib.style.add(args.feature, args.name);
  lib.test.add(args.feature, args.name);
}

if (args = program.page) {
  lib.component.add(args.feature, args.name, { templateFile: 'Page.js' });
  lib.route.add(args.feature, args.name, program.urlPath);
  lib.style.add(args.feature, args.name);
  lib.test.add(args.feature, args.name, { templateFile: 'Page.test.js' });
}

if (args = program.action) {
  lib.action.add(args.feature, args.name, args.actionType);
}

if (args = program.asyncAction) {
}

if (args = program.test) {

}

lib.inout.flush();
console.log('');
console.timeEnd('✨  Done');
console.log('');
