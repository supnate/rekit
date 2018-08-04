require('./');

// console.log('read dir: ', rekit.common.projectFiles.readDir());
// console.log('project data: ', rekit.core.app.getProjectData());
console.time('test');
// console.log(rekit.core.app.getProjectData());
// rekit.core.app.getProjectData();

// rekit.core.element.add('action', 'a1');
rekit.core.element.add('component', 'home/c1', {});
rekit.core.vio.flush();
console.timeEnd('test');
