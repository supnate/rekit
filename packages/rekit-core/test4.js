const rekit = require('./');

rekit.core.paths.setProjectRoot('/Users/pwang7/workspace/a1');

const { files } = rekit.core;
// rekit.core.paths.setProjectRoot('/Users/pwang7/workspace/rekitebaynode');

rekit.core.files.readDir();

files.on('change', () => {
  console.log('on file change');
  console.time('read dir');
  rekit.core.files.readDir();
  console.timeEnd('read dir');
});
console.log(rekit.core.plugin.getPlugins().map(p => p.name));
