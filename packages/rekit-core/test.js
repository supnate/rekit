require('./');

// console.log('read dir: ', rekit.common.projectFiles.readDir());
// console.log('project data: ', rekit.core.app.getProjectData());
console.time('test');
rekit.core.app.getProjectData();
console.timeEnd('test');

// rekit.core.element.add('action', 'a1');
// rekit.core.element.add('component', 'c1');
