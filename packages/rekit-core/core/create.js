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
const config = require('./config');
const paths = require('./paths');

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
    syncAppRegistryRepo()
      .then(() => {
        resolve(fs.readJsonSync(paths.configFile('app-registry/appTypes.json')));
      })
      .catch(err => {
        console.log('Failed to get app types: ', err);
        reject('GET_APP_TYPES_FAILED');
      });
  });
}

function cloneRepo(gitRepo, prjDir) {
  console.log('Cloning repp: ', gitRepo);
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

function syncAppRegistryRepo() {
  const registryDir = paths.configFile('app-registry');
  return new Promise((resolve, reject) => {
    const appRegistry = config.getAppRegistry();
    const arr = appRegistry.split('/');
    const owner = arr[0];
    const arr2 = arr[1].split('#');
    const repo = arr2[0];
    const branch = arr2[1] || 'master';
    console.log(owner, repo, branch);
    https
      .get(
        `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
        { headers: { 'User-Agent': 'rekit-core' } },
        resp => {
          let data = '';

          // A chunk of data has been recieved.
          resp.on('data', chunk => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            try {
              const ref = JSON.parse(data);
              const lastCommit = ref.object.sha;
              if (!fs.existsSync(path.join(registryDir, lastCommit))) {
                fs.removeSync(registryDir);
                cloneRepo(appRegistry, registryDir)
                  .then(() => {
                    fs.writeFileSync(path.join(registryDir, lastCommit), '');
                    resolve(lastCommit);
                  })
                  .catch(reject);
              } else {
                console.log('App registry is up to date.');
                resolve();
              }
            } catch (err) {
              reject(err);
            }
          });
        }
      )
      .on('error', err => {
        console.log('Failed to get last commit of app registry: ', err);
        reject('FAILED_CHECK_APP_REGISTRY_LATEST_COMMIT');
      });
  });
}

module.exports = create;
module.exports.syncAppRegistryRepo = syncAppRegistryRepo;
