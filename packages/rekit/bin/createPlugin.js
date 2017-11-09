'use strict';

// Summary:
//  Create a new project.

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

function createPlugin(args, rekitCore) {
  const pluginName = _.kebabCase(args.name.replace(/^rekit-plugin-/i, ''));
  if (!pluginName) {
    console.log('Error: please specify the plugin name.');
    process.exit(1);
  }
  console.log('Creating plugin: ', pluginName);

  let pluginRoot;
  if (rekitCore) {
    // Inside a Rekit project
    const pluginsDir = path.join(rekitCore.utils.getProjectRoot(), 'tools/plugins');
    pluginRoot = path.join(pluginsDir, pluginName);
    if (!fs.existsSync(pluginsDir)) {
      fs.mkdirSync(pluginsDir);
    }
  } else {
    pluginRoot = path.join(process.cwd(), `rekit-plugin-${pluginName}`);
  }

  fs.mkdirSync(pluginRoot);
  const mapFile = file => path.join(pluginRoot, file);

  // Create plugin files
  console.log('Copying files...');
  [
    'config.js',
    'elementType.js',
    'package.json.tpl',
  ].forEach((file) => {
    const tpl = fs.readFileSync(path.join(__dirname, 'plugin-template', file)).toString();
    const compiled = _.template(tpl);
    const content = compiled({ pluginName });
    fs.writeFileSync(mapFile(file), content);
  });

  // Rename elementType file to real plugin name
  fs.renameSync(mapFile('elementType.js'), mapFile(`${_.camelCase(pluginName)}.js`));

  // Delete package.json if inside a Rekit project
  if (rekitCore) {
    fs.unlinkSync(mapFile('package.json.tpl'));
  } else {
    fs.renameSync(mapFile('package.json.tpl'), mapFile('package.json'));
  }

  console.log('Plugin creation success: ', pluginRoot);
  console.log('Learn more about Rekit plugin at: http://rekit.js.org/docs/plugin.html');
}

module.exports = createPlugin;
