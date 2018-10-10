const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { vio, template } = rekit.core;

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

function move(source, target) {
  const name1 = _.kebabCase(source);
  const name2 = _.kebabCase(target);

  const tpl = `src/ui-modules/${name1}/index.marko`;
  if (vio.fileExists(tpl)) {
    const content = vio
      .getContent(tpl)
      .replace(`class="ui-module-${name1}"`, `class="ui-module-${name2}"`)
      .replace(`>UI Module: ${name1}<`, `>UI Module: ${name2}<`);
    vio.save(tpl, content);
  }

  const less = `src/ui-modules/${name1}/style.less`;
  if (vio.fileExists(less)) {
    const content = vio.getContent(less).replace(`.ui-module-${name1} {`, `.ui-module-${name2} {`);
    vio.save(less, content);
  }

  // rename dir
  vio.moveDir(`src/ui-modules/${name1}`, `src/ui-modules/${name2}`);

}

module.exports = { add, remove, move };
