const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { vio, template, utils } = rekit.core;

function add(name, args) {
  name = _.kebabCase(name);
  const tplDir = path.join(__dirname, './templates/layout');
  const tplFiles = fs.readdirSync(tplDir);
  const targetDir = `src/layouts/${name}`;
  vio.mkdir(targetDir);
  tplFiles.forEach(tplFile => {
    const targetPath = `${targetDir}/${tplFile.replace(/\.tpl$/, '')}`;
    template.generate(targetPath, {
      templateFile: path.join(tplDir, tplFile),
      context: { name },
    });
  });
}

function remove(name, args) {
  name = _.kebabCase(name);
  const targetDir = `src/layouts/${name}`;
  vio.del(targetDir);
}

module.exports = { add, remove };
