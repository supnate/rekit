const path = require('path');
const _ = require('lodash');
const style = require('./style');

const { vio, template, paths, refactor } = rekit.core;

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

  const targetPath = `src/features/${arr.join('/')}/${name}.js`;

  const tplFile = connected ? './templates/ConnectedComponent.js.tpl' : './templates/Component.js.tpl';
  template.generate(paths.map(targetPath), {
    templateFile: path.join(__dirname, tplFile),
    context: Object.assign({ prefix, elePath, name }, args.context || {}),
  });

  // Add style file
  style.add(elePath, args);

  // Add to index.js, should this be optional?
  const indexPath = `src/features/${arr[0]}/index.js`;
  refactor.addExportFrom(indexPath, paths.relative(indexPath, targetPath).replace(/\.js$/, ''), name);

  // Add to route.js if urlPath exists
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
  move,
};
