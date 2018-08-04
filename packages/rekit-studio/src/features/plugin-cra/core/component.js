const path = require('path');
const _ = require('lodash');
const entry = require('./entry');
const style = require('./style');

const { vio, template, paths } = rekit.core;

_.pascalCase = _.flow(
  _.camelCase,
  _.upperFirst
);
_.upperSnakeCase = _.flow(
  _.snakeCase,
  _.toUpper
);

function add(elePath, args) {
  const { connected, urlPath } = args;
  const arr = elePath.split('/');
  const name = _.pascalCase(arr.pop());
  const prefix = arr.join('-');

  const tplFile = connected ? './templates/ConnectedComponent.js.tpl' : './templates/Component.js.tpl';
  template.generate(paths.map(`src/features/${arr.join('/')}/${name}.js`), {
    templateFile: path.join(__dirname, tplFile),
    context: Object.assign({ prefix, elePath, name }, args.context || {}),
  });

  style.add(elePath, args);
  // entry.addToIndex(elePath, args);
}
function move(source, target, args) {
  console.log('moving component: ', source, target, args);
}
function remove(name, args) {
  const { feature } = args;
  vio.del(paths.map(`src/features/${feature}/${name}.js`));
}

module.exports = {
  add,
  remove,
};
