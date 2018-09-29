const rekit = require('./');

rekit.core.paths.setProjectRoot('/Users/pwang7/workspace/rekit/packages/rekit-studio');
// rekit.core.paths.setProjectRoot('/Users/pwang7/workspace/rekitebaynode');
let prjData;
console.log(rekit.core.plugin.getPlugins().map(p => p.name));
console.time('Load project data');
rekit.core.vio.reset();
prjData = rekit.core.app.getProjectData();
console.timeEnd('Load project data');

console.time('Load project data');
rekit.core.vio.reset();
prjData = rekit.core.app.getProjectData();
console.timeEnd('Load project data');

// console.time('Load project data 2');
// rekit.core.vio.reset();
// rekit.core.app.getProjectData();
// console.timeEnd('Load project data 2');

// console.time('Load project data 3');
// rekit.core.vio.reset();
// rekit.core.app.getProjectData();
// console.timeEnd('Load project data 3');

// console.log(prjData);
Object.values(prjData.elementById).forEach(ele => {
  if (ele.id.endsWith('.marko')) console.log(ele);
});
