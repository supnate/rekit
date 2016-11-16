/* eslint no-cond-assign: 0*/
'use strict';
// Summary:
//   Add a Rekit element.
//
// Example:
//   node rm.js -c, --component <feature>/<name>
//   node rm.js -p, --page <feature>/<name> -u, --url-path [url-path]
//   node rm.js -a, --action <feature>/<name> -t, --action-type [action-type]
//   node rm.js -A, --async-action <feature>/<name>

const lib = require('./lib');

console.time('✨  Done');
const program = lib.args.parse1();

let args;
if (args = program.component) {
  lib.component.remove(args.feature, args.name);
  lib.style.remove(args.feature, args.name);
  lib.test.remove(args.feature, args.name);
}

if (args = program.page) {
  lib.component.remove(args.feature, args.name);
  lib.route.remove(args.feature, args.name);
  lib.style.remove(args.feature, args.name);
  lib.test.remove(args.feature, args.name);
}

if (args = program.action) {
  lib.action.remove(args.feature, args.name, args.actionType);
}

if (args = program.asyncAction) {

}

if (args = program.test) {

}

lib.inout.flush();
console.log('');
console.timeEnd('✨  Done');
console.log('');
