'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function installPlugin(args, rekitCore) {
  console.time('Done.');

  if (!rekitCore) {
    console.log('Error: it\'s not a Rekit project, or Rekit core has not been installed.');
    return;
  }

  const prjRoot = rekitCore.utils.getProjectRoot();

  let pluginName = args.name;
  if (!/^rekit-plugin/.test(pluginName)) pluginName = `rekit-plugin-${pluginName}`;
  console.log('Installing plugin: ', pluginName);

  // 1. install the plugin from npm
  // check if the plugin has been installed.
  if (fs.existsSync(path.join(prjRoot, 'node_modules', pluginName, 'package.json'))) {
    console.log('Warning: the plugin has been already installed.');
  } else {
    let cmd;
    if (fs.existsSync(path.join(prjRoot, 'yarn.lock'))) {
      cmd = `yarn add ${pluginName}`;
    } else {
      cmd = `npm install ${pluginName} --save-dev`;
    }
    execSync(cmd, { cwd: prjRoot, stdio: 'pipe' });
  }

  // 2. register the plugin into rekit.plugins in package.json if have not
  console.log('Writing to package.json...');
  const pkgJsonPath = path.join(prjRoot, 'package.json');
  delete require.cache[pkgJsonPath];
  const pkg = require(path.join(prjRoot, 'package.json')); // eslint-disable-line
  if (!pkg.rekit.plugins) pkg.rekit.plugins = [];
  const shortName = pluginName.replace(/^rekit-plugin-/, '');
  if (pkg.rekit.plugins.indexOf(pluginName) === -1 && pkg.rekit.plugins.indexOf(shortName) === -1) {
    pkg.rekit.plugins.push(shortName);
    fs.writeFileSync(path.join(prjRoot, 'package.json'), JSON.stringify(pkg, null, '  '));
  } else {
    console.log('Warning: the plugin has been in package.json');
  }

  // 3. execute install.js if exists
  console.log('Executing install.js if exists...');
  const installFile = path.join(prjRoot, 'node_modules', pluginName, 'install.js');
  if (fs.existsSync(installFile)) {
    // It's plugin's responsibility to handle multiple installation
    require(installFile)(rekitCore); // eslint-disable-line
  }

  console.timeEnd('Done.');
}

module.exports = installPlugin;
