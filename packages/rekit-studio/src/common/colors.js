import plugin from './plugin';

export default (type, light) => {
  const colors = plugin.getPlugins('colors').reduce((prev, curr) => {
    Object.assign(prev, curr.colors);
    return prev;
  }, {});

  return colors[type] || colors.file;
};
