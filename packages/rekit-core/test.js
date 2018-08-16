require('./');

// console.log('read dir: ', rekit.common.projectFiles.readDir());
// console.log('project data: ', rekit.core.app.getProjectData());
console.time('test');
// console.log(rekit.core.app.getProjectData());
// console.log(rekit.core.app.getProjectData());

// rekit.core.element.add('action', 'a1');
// rekit.core.element.add('component', 'home/c1', {});
// rekit.core.vio.flush();
const toDeps = [
  'src/abc/core/component.js',
  'src/features/examples/redux/actions.js',
  'src/features/examples/RedditListPage.js',
];
toDeps.forEach(f => console.log(f, rekit.core.deps.getDeps(f)));
console.timeEnd('test');
