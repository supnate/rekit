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
  vio.del(localeFile);

  // Remove routes
  const routesJsonPath = 'routes.json';
  let routesJson = JSON.parse(vio.getContent(routesJsonPath));
  routesJson = _.filter(
    routesJson,
    r => !r.route || !new RegExp(`=> ?./src/pages/${name}\$`).test(r.route)
  );
  vio.save(routesJsonPath, JSON.stringify(routesJson, null, 4));
}

module.exports = {
  add,
  remove,
};
