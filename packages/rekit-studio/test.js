'use strict';

const path = require('path');
const fetchProjectData = require('./middleware/api/fetchProjectData');
// console.log(path.join('/Users/abc/../def', '../nate'));
// console.log(path.resolve('/Users/abc/../nate'));
const core = require('rekit-core');
const helpers = require('./middleware/helpers');
console.log(helpers.forceRequire('lodash/package.json').version);
console.log(helpers.forceRequire('lodash/package.json').version);
console.time('Done');
// fetchProjectData();
// console.log(JSON.stringify(fetchProjectData().features[1].components[1].deps.actions));
console.timeEnd('Done');
// const _ = require('lodash');

// const refactor = core.refactor;
// const vio = core.vio;
// const utils = core.utils;
// const spawn = require('child_process').spawn;

// // console.time('Done ');
// const file = utils.mapFeatureFile('home', 'Navigator.js');
// // const deps = refactor.getDeps(file);
// const features = refactor.getFeatures();
// const data = features.map(f => (Object.assign({
//   key: f,
//   name: _.flow(_.lowerCase, _.upperFirst)(f),
// }, refactor.getFeatureStructure(f))));
// console.log(data.map(d => d.routes));

// // data.forEach((f) => {
// //   f.components.forEach((item) => {
// //     item.deps = refactor.getDeps(item.file);
// //     // console.log('getting deps for ', item.name, item.deps);
// //   });

// //   f.actions.forEach((item) => {
// //     item.deps = refactor.getDeps(item.file);
// //   });

// //   f.misc.forEach((item) => {
// //     if (!item.children && /\.js$/.test(item.file)) item.deps = refactor.getDeps(item.file);
// //   });
// // });


// // utils.setProjectRoot('/Users/nate/workspace2/rekit');

// // function runBuild() {
// //   const prjRoot = utils.getProjectRoot();
// //   return new Promise((resolve) => {
// //     const child = spawn('node',
// //       [
// //         `${prjRoot}/tools/run_test.js`,
// //         '/**/*.test.js',
// //       ],
// //       {
// //         stdio: 'pipe',
// //         cwd: prjRoot
// //       }
// //     );
// //     child.stdout.pipe(process.stdout);
// //     // const arr = [];
// //     const handleOutput = (data) => {
// //       // collect the data
// //       // const text = data.toString('utf8');
// //       // console.log(text);
// //       // text.forEach(t => arr.push(t));
// //     };
// //     child.stdout.on('data', handleOutput);
// //     child.stderr.on('data', handleOutput);

// //     child.on('close', () => {
// //       resolve();
// //     });
// //   });
// // }

// // runBuild();


// // console.timeEnd('Done ');
