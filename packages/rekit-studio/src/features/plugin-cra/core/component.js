const path = require('path');
const _ = require('lodash');

const { vio, template, paths } = rekit.core;

_.pascalCase = _.flow(_.camelCase, _.upperFirst);
_.upperSnakeCase = _.flow(_.snakeCase, _.toUpper);

function add(filePath, args) {
  let { connected, urlPath } = args;
  const arr = filePath.split('/');
  const name = _.pascalCase(arr.pop());
  const prefix = arr.join('-');

  // feature = _.kebabCase(feature);


  template.generate(paths.map(`src/features/${arr.join('/')}/${name}.js`), {
    templateFile: path.join(__dirname, './templates/Component.js.tpl'),
    context: Object.assign({ prefix, filePath, name }, args.context || {}),
  });

  // create component from template
  // args = args || {};
  // template.generate(utils.mapComponent(feature, component) + '.js', Object.assign({}, args, {
  //   templateFile: args.templateFile || 'Component.js',
  //   context: Object.assign({ feature, component }, args.context || {}),
  // }));

  // add to index.js
  // entry.addToIndex(feature, component);
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
