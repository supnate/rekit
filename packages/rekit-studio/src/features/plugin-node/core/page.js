const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { vio, template, paths, config } = rekit.core;

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
  const name1 = _.kebabCase(source.name);
  const name2 = _.kebabCase(target.name);
  const appName = config.getPkgJson().name;

  // rename dir
  vio.mvDir(name1, name2);

  // Rename locale file if it exists
  const localeFile1 = `locales/en/${_.pascalCase(appName)}/${name1}.properties`;
  const localeFile2 = `locales/en/${_.pascalCase(appName)}/${name2}.properties`;
  if (vio.fileExists(localeFile1) && !vio.fileExists(localeFile2)) vio.mv(localeFile1, localeFile2);

  // Rename route path if it exists
  const routesJson = JSON.parse(vio.getContent('routes.json'));
  routesJson.forEach(item => {
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
