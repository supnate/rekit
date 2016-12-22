'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const request = require('request'); // use request lib so that it respects proxy

// Credit to: http://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
function copyFileSync(source, target) {
  let targetFile = target;

  // if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

// Credit to: http://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
function copyFolderRecursiveSync(source, target, filter) {
  let files = [];

  // check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder, filter);
      } else if (!filter || filter(curSource)) {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = dirPath + '/' + file; // eslint-disable-line
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

function requestDeps() {
  return new Promise((resolve, reject) => {
    request('https://supnate.github.io/rekit-deps/deps.2.x.json', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body) // Show the HTML for the Google homepage. 
        resolve(JSON.parse(body));
      } else {
        reject(error || response.statusCode);
      }
    })

    // https.get('https://supnate.github.io/rekit-deps/deps.2.x.json', (res) => {
    //   const statusCode = res.statusCode;
    //   const contentType = res.headers['content-type'];

    //   let error;
    //   if (statusCode !== 200) {
    //     error = new Error(`Request Failed.\n` +
    //                       `Status Code: ${statusCode}`);
    //   } else if (!/^application\/json/.test(contentType)) {
    //     error = new Error(`Invalid content-type.\n` +
    //                       `Expected application/json but received ${contentType}`);
    //   }
    //   if (error) {
    //     reject(error.message);
    //     // consume response data to free up memory
    //     res.resume();
    //     return;
    //   }

    //   res.setEncoding('utf8');
    //   let rawData = '';
    //   res.on('data', (chunk) => { rawData += chunk; });
    //   res.on('end', () => {
    //     try {
    //       const parsedData = JSON.parse(rawData);
    //       resolve(parsedData);
    //     } catch (e) {
    //       reject(e.message);
    //     }
    //   });
    // }).on('error', (e) => {
    //   reject(e.message);
    // });
  });
}

module.exports = {
  copyFileSync,
  copyFolderRecursiveSync,
  deleteFolderRecursive,
  requestDeps,
};
