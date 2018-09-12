const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { vio, template, utils } = rekit.core;

function add(elePath, args) {
  const arr = elePath.split('/');
  const name = _.kebabCase(arr.pop());
  const p = arr.join('/'); //maybe empty
  const tplDir = path.join(__dirname, './templates/ui-module');
  const tplFiles = fs.readdirSync(tplDir);
  const targetDir = path.join('src/ui-modules', p, name);//`src/ui-modules/${name}`;
  vio.mkdir(targetDir);
  tplFiles.forEach(tplFile => {
    const targetPath = `${targetDir}/${tplFile.replace(/\.tpl$/, '')}`;
    template.generate(targetPath, {
      templateFile: path.join(tplDir, tplFile),
      context: { name },
    });
  });
}

function remove(elePath, args) {
  const arr = elePath.split('/');
  const name = _.kebabCase(arr.pop());
  const p = arr.join('/');
  const targetDir = path.join('src/ui-modules', p, name);
  vio.del(targetDir);
}

module.exports = { add, remove };
