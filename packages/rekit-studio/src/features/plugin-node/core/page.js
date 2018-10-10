const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { vio, template, config } = rekit.core;

function add(name, args) {
  name = _.kebabCase(name);
  const appName = config.getPkgJson().name;
  const tplDir = path.join(__dirname, './templates/page');
  const tplFiles = fs.readdirSync(tplDir);
  vio.mkdir(`src/pages/${name}`);
  tplFiles.forEach(tplFile => {
    template.generate(`src/pages/${name}/${tplFile.replace(/\.tpl$/, '')}`, {
      templateFile: path.join(tplDir, tplFile),
      context: { ...args, name, appName },
    });
  });

  // Creatte the locale file
  if (args.locale) {
    const localeFile = `locales/en/${_.pascalCase(appName)}/${name}.properties`;
    vio.save(localeFile, `name=${name}\n`);
  }

  // Create route path
  if (args.urlPath) {
    const routesJson = JSON.parse(vio.getContent('routes.json'));
    routesJson.unshift({
      route: `GET /${args.urlPath} => ./src/pages/${name}`,
      pageName: _.pascalCase(name),
    });

    vio.save('routes.json', JSON.stringify(routesJson, null, 4));
  }
}

function remove(name, args) {
  name = _.kebabCase(name);
  const targetDir = `src/pages/${name}`;
  vio.del(targetDir);

  // Remove locale file
  const appName = config.getPkgJson().name;
  const localeFile = `locales/en/${_.pascalCase(appName)}/${name}.properties`;
  if (vio.fileExists(localeFile)) vio.del(localeFile);

  // Remove routes
  const routesJsonPath = 'routes.json';
  let routesJson = JSON.parse(vio.getContent(routesJsonPath));
  routesJson = _.filter(
    routesJson,
    r => !r.route || !new RegExp(`=> ?./src/pages/${name}\$`).test(r.route)
  );
  vio.save(routesJsonPath, JSON.stringify(routesJson, null, 4));
}

function move(source, target) {
  const name1 = _.kebabCase(source);
  const name2 = _.kebabCase(target);
  const appName = config.getPkgJson().name;

  const tpl = `src/pages/${name1}/template.marko`;
  if (vio.fileExists(tpl)) {
    const i18nKey1 = `i18n${_.pascalCase(appName)}${_.pascalCase(name1)}`;
    const i18nKey2 = `i18n${_.pascalCase(appName)}${_.pascalCase(name2)}`;
    const i18nFile1 = `"${_.pascalCase(appName)}/${name1}"`;
    const i18nFile2 = `"${_.pascalCase(appName)}/${name2}"`;
    const content = vio
      .getContent(tpl)
      .replace(`className="page-${name1}"`, `className="page-${name2}"`)
      .replace(`>Page content: ${name1}<`, `>Page content: ${name2}<`)
      .replace(i18nFile1, i18nFile2)
      .replace(new RegExp(i18nKey1, 'g'), i18nKey2);
    vio.save(tpl, content);
  }

  const less = `src/pages/${name1}/style.less`;
  if (vio.fileExists(less)) {
    const content = vio.getContent(less).replace(`.page-${name1} {`, `.page-${name2} {`);
    vio.save(less, content);
  }

  // rename dir
  vio.moveDir(`src/pages/${name1}`, `src/pages/${name2}`);

  // Rename locale file if it exists
  const localeFile1 = `locales/en/${_.pascalCase(appName)}/${name1}.properties`;
  const localeFile2 = `locales/en/${_.pascalCase(appName)}/${name2}.properties`;
  if (vio.fileExists(localeFile1) && !vio.fileExists(localeFile2)) vio.move(localeFile1, localeFile2);

  // Rename route path if it exists
  const routesJson = JSON.parse(vio.getContent('routes.json'));
  routesJson.forEach(item => {
    if (item.route && item.route.endsWith(`./src/pages/${name1}`))
      item.route = item.route.replace(`./src/pages/${name1}`, `./src/pages/${name2}`);
    if (item.pageName === _.pascalCase(name1)) {
      item.pageName = _.pascalCase(name2);
    }
  });
  vio.save('routes.json', JSON.stringify(routesJson, null, 4));
}

module.exports = {
  add,
  remove,
  move,
};
