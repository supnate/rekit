'use strict';

const rekitCore = require('rekit-core');
const dotenv = require('dotenv');
const fs = require('fs');
const helpers = require('../helpers');
const getFileContent = require('./getFileContent');

const utils = rekitCore.utils;
const prjRoot = utils.getProjectRoot();

function getEnvFileVars(path) {
  let envVars = {};

  const absPath = utils.joinPath(prjRoot, path);
  if (fs.existsSync(absPath)) {
    const content = getFileContent(absPath);
    if (content) envVars = dotenv.parse(content);
  }

  return envVars;
}

function fetchEnvVars() {
  let envVars = {
    all: {},
    production: {},
    development: {},
    test: {},
    demo: {},
  };

  Object.keys(envVars).forEach(key => {
    const envFileName = key === 'all' ? '.env' : `.env.${key}`;

    const general = getEnvFileVars(envFileName);
    const local = getEnvFileVars(`${envFileName}.local`);

    envVars[key] = { general, local };
  });

  return envVars;
}

module.exports = fetchEnvVars;
