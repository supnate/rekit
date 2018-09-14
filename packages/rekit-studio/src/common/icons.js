import plugin from './plugin';

export default type => {
  const icons = plugin.getPlugins('icons').reduce((prev, curr) => {
    Object.assign(prev, curr.icons);
    return prev;
  }, {});
  return icons[type] || 'file';
};
