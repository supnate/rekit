'use strict';

// Summary:
//  Create a new project.

const path = require('path');
const fs = require('fs');
const download = require('download-git-repo');
const utils = require('./utils');

function createApp(args) {
  const prjName = args.name;
  if (!prjName) {
    console.log('Error: please specify the project name.');
    process.exit(1);
  }

  // The created project dir
  const prjPath = path.join(process.cwd(), prjName);
  if (fs.existsSync(prjPath)) {
    console.log(`Error: target folder already exists: ${prjPath}`);
    process.exit(1);
  }
  console.log('Welcome to Rekit, now creating your project...');
  fs.mkdirSync(prjPath);

  // Download boilerplate from: https://github.com/supnate/rekit-boilerplate
  console.log('Downloading the boilerplate...');
  download('supnate/rekit-boilerplate#dist', prjPath, (err) => {
    if (err) {
      console.log('Failed to get dependencies. The project was not created. Please check and retry.');
      console.log(err);
      utils.deleteFolderRecursive(prjPath);
      process.exit(1);
    } else {
      // Remove yarn.ock
      fs.unlinkSync(path.join(prjPath, 'yarn.lock')); // Remove yarn.lock

      // Modify package.json
      const appPkgJson = require(path.join(prjPath, 'package.json')); // eslint-disable-line
      appPkgJson.name = prjName;
      appPkgJson.description = `${prjName} created by Rekit.`;

      console.log('Project creation success!');
      console.log(`To run the project, please go to the project folder "${prjName}" and:`);
      console.log('  1. run "npm install" to install dependencies.');
      console.log('  2. run "npm start" to start the dev server.');
      console.log('Enjoy!');
      console.log('');
    }
    console.log(err ? 'Error' : 'Success');
  });
}

module.exports = createApp;
