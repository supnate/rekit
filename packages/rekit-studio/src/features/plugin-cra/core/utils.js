const _ = require('lodash');

const { config } = rekit.core;

const pascalCase = _.flow(
  _.camelCase,
  _.upperFirst
);

function parseElePath(elePath, type) {
  const arr = elePath.split('/');
  let name = arr.pop();
  if (type === 'component' || type === 'style') name = pascalCase(name);
  else if (type === 'action') name = _.camelCase(name);
  elePath = [...arr, name].join('/');
  const feature = arr[0];
  return {
    name,
    path: elePath,
    feature,
    modulePath: `src/features/${elePath}.js`,
    stylePath: `src/features/${elePath}.${config.style}`,
  };
}

module.exports = {
  parseElePath,
};
