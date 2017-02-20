'use strict';

// Run this test before published to npm, it simulates a clean env for ensure rekit command could
// be installed globally and rekit-core, rekit-portal works as expected.


// 1. Uninstall rekit -g, npm unlink rekit from rekit folder.
// 2. Install rekit to global from local folder
// 3. run rekit create to create an app
// 4. install app (optional use local rekit-core and rekit-portal)
// 5. app test should pass
// 6. npm start for manually test

const path = require('path');
const shell = require('shelljs');

const prjRoot = path.join(__dirname, '..');

console.log('Uninstalling Rekit globally......');
shell.exec('npm uninstall -g rekit');

console.log('Unlinking Rekit......');
shell.exec('npm unlink', { cwd: prjRoot });

console.log('Install Rekit globally from local folder...');
shell.exec(`npm install -g ${prjRoot}`);
