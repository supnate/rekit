const rekit = require('./');

rekit.core.paths.setProjectRoot('/Users/pwang7/workspace/rekit/packages/rekit-studio');

const { files, app } = rekit.core;

files.readDir();

files.on('change', () => {
  console.time('get prj data');
  const data = app.getProjectData();
  console.timeEnd('get prj data');
});
