const rekit = require('rekit-core');
rekit.core.paths.setProjectRoot('/Users/pwang7/workspace/rekitebaynode/');

console.log(rekit.core.app.getProjectData());

rekit.core.plugin.getPlugins().forEach(p => console.log(p.name));
