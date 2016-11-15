const program = require('commander');
const inout = require('./lib/inout');
const component = require('./lib/component');
const style = require('./lib/style');
const test = require('./lib/test');

let feature;
let name;

program
  .arguments('<component>')
  .action((arg1) => {
    const arr = arg1.split('/');
    feature = arr[0];
    name = arr[1];
  })
  .parse(process.argv);

component.add(feature, name);
style.add(feature, name);
test.add(feature, name);

inout.flush();
