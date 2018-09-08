const rekit = require('./');

rekit.core.paths.setProjectRoot('/Users/pwang7/workspace/rekit/packages/rekit-studio');

console.time('Load project data');
rekit.core.vio.reset();
rekit.core.app.getProjectData();
console.timeEnd('Load project data');

console.time('Load project data 2');
rekit.core.vio.reset();
rekit.core.app.getProjectData();
console.timeEnd('Load project data 2');

console.time('Load project data 3');
rekit.core.vio.reset();
rekit.core.app.getProjectData();
console.timeEnd('Load project data 3');
