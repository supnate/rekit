/*
 * Create a Rekit project. Boilerplates are provided by Rekit plugins.
 *
 * To create a Rekit project:
 *  - If options.source is a local folder, then copy content from it (excepts node_modules and .git folders),
 *    if it's a git url, clone it.
 *  - Otherwise, looks for project type registry from https://github.com/supnate/rekit-registry/appTypes.json,
 *    clone the repo to the project folder.
 *  - Execute postCreate.js
 *
*/

const path = require('path');
const https = require('https');
const fs = require('fs-extra');
const download = require('download-git-repo');

function create(options) {
  console.log('Creating app: ', options);

  if (!options.status)
    options.status = (code, msg) => {
      console.log(msg);
    };
  if (!options.type) options.type = 'rekit-react';

  const prjDir = path.join(options.location || process.cwd(), options.name);
  return new Promise(async (resolve, reject) => {
    try {
      if (fs.existsSync(prjDir)) {
        reject('FOLDER_EXISTS');
        return;
      }
      fs.mkdirSync(prjDir);
      let gitRepo;
      if (options.source) {
        if (/^https?:/.test(options.source)) {
          // It's a git repo
          gitRepo = options.source;
        } else {
          // It's a local folder
          const srcDir = path.isAbsolute(options.source) ? options.source : path.join(process.cwd(), options.source);
          options.status('CREATE_APP_COPY_FILES', `Copy files from ${srcDir}...`);
          await fs.copy(srcDir, prjDir, {
            filter: src => !/\/(\.git|node_modules\/|node_modules$)/.test(src),
          });
        }
      } else if (options.type) {
        // Get gitRepo
        options.status('QUERY_APP_TYPES_GIT_REPO', `Looking for the git repo for app type ${options.type}...`);
        const appTypes = await getAppTypes();
        if (!appTypes[options.type]) reject('APP_TYPE_NOT_SUPPORTED');
        gitRepo = appTypes[options.type].repo;
      } else {
        await fs.remove(prjDir);
        reject('NO_SOURCE_OR_APP_TYPE');
      }

      if (gitRepo) {
        options.status('CLONE_PROJECT', `Cloning project from ${gitRepo}...`);
        await cloneRepo(gitRepo, prjDir);
      }

      postCreate(prjDir, options);
      options.status('CREATION_SUCCESS', '😃App creation success.');
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function getAppTypes() {
  return new Promise((resolve, reject) => {
    https
      .get('https://raw.githubusercontent.com/supnate/rekit-registry/master/appTypes.json', resp => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          const appTypes = JSON.parse(data);
          resolve(appTypes);
        });
      })
      .on('error', err => {
        console.log('Failed to get app types: ', err);
        reject('GET_APP_TYPES_FAILED');
      });
  });
}

function cloneRepo(gitRepo, prjDir) {
  return new Promise((resolve, reject) => {
    const isDirect = /^https?:/.test(gitRepo);
    download(isDirect ? `direct:${gitRepo}` : gitRepo, prjDir, { clone: isDirect }, err => {
      if (err) {
        console.log('Failed to download the boilerplate. The project was not created. Please check and retry.');
        console.log(err);
        reject('CLONE_REPO_FAILED');
        return;
      }
      resolve();
    });
  });
}

function postCreate(prjDir, options) {
  const postCreateScript = path.join(prjDir, 'postCreate.js');
  if (fs.existsSync(postCreateScript)) {
    options.status('POST_CREATE', 'Executing post create script...');
    require(postCreateScript)(options);
    fs.removeSync(postCreateScript);
  }
}

module.exports = create;
