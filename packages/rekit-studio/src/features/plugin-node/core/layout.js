const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { vio, template } = rekit.core;

_.pascalCase = _.flow(_.camelCase, _.upperFirst);
_.upperSnakeCase = _.flow(_.snakeCase, _.toUpper);

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

function move(source, target) {
  const name1 = _.kebabCase(source);
  const name2 = _.kebabCase(target);

  // rename dir
  vio.moveDir(`src/layouts/${name1}`, `src/layouts/${name2}`);
}


module.exports = { add, remove, move };
