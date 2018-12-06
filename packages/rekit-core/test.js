const rekit = require('./');

rekit.core.paths.setProjectRoot('/Users/pwang7/workspace/rekit/packages/rekit-core');
// rekit.core.paths.setProjectRoot('/Users/pwang7/workspace/rekitebaynode');
let prjData;
console.log(rekit.core.plugin.getPlugins().map(p => p.name));
console.time('Load project data');
// rekit.core.vio.reset();
prjData = rekit.core.app.getProjectData();
console.timeEnd('Load project data');
console.log(prjData);

rekit.core.files.on('change', () => {
  console.log('files changed');
  console.time('Load project');

  prjData = rekit.core.app.getProjectData();
  console.log(prjData);
  // prjData = rekit.core.files.readDir();
  console.timeEnd('Load project');
  // Object.keys(prjData.elementById)
  //   .filter(s => /\/home\/redux\//.test(s) && !/test/.test(s))
  //   .forEach(k => console.log(k));
});

// console.time('Load project data');
// rekit.core.vio.reset();
// prjData = rekit.core.app.getProjectData();
// console.timeEnd('Load project data');

// console.time('Load project data 2');
// rekit.core.vio.reset();
// rekit.core.app.getProjectData();
// console.timeEnd('Load project data 2');

// console.time('Load project data 3');
// rekit.core.vio.reset();
// rekit.core.app.getProjectData();
// console.timeEnd('Load project data 3');

// console.log(prjData);
// Object.values(prjData.elementById).forEach(ele => {
//   if (ele.id.endsWith('.marko')) console.log(ele);
// });
