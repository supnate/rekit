import plugin from './plugin';

export default type => {
  const colors = plugin.getPlugins('colors').reduce((prev, curr) => {
    Object.assign(prev, curr.colors);
    return prev;
  }, {});
  return colors[type] || 'file';
};
