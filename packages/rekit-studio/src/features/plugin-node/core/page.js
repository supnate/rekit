const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { vio, template, paths, config } = rekit.core;

// Add a component
// elePath format: home/MyComponent, home/subFolder/MyComponent
function add(name, args) {
  // const arr = args.name.split('/');
  name = _.kebabCase(name);

  const tplDir = path.join(__dirname, './templates/page');
  const tplFiles = fs.readdirSync(tplDir);
  const targetDir = paths.map(`src/pages/${name}`);
  vio.mkdir(targetDir);
  // _.pull(tplFiles, 'template.marko');
  tplFiles.forEach(tplFile => {
    template.generate(`src/pages/${name}/${tplFile.replace(/\.tpl$/, '')}`, {
      templateFile: path.join(tplDir, tplFile),
      context: { ...args, name, appName: config.getPkgJson().name },
    });
  });

  // Create template marko
  // const lines = ['<lasso-page package-path="./browser.json"/>'];

  // // Create locale file
  // let pageContent;
  // if (args.i18n) {
  //   const i18nVar = `i18n${_.pascalCase(appName)}${_.pascalCase(name)}`;
  //   lines.push(`<i18n-use ${i18nVar}="${_.pascalCase(appName)}/${name}"/>`);
  //   const i18nDir = path.join(prjRoot, 'locales/en', _.pascalCase(appName));
  //   if (!vio.dirExists(i18nDir)) vio.mkdir(i18nDir);
  //   const i18nFile = path.join(i18nDir, `${name}.properties`);
  //   vio.save(i18nFile, `name=${name}\n`);

  //   pageContent = `<div className="page-${name}">Page content: \${${i18nVar}.get('name')}</div>`;
  // } else {
  //   pageContent = `<div className="page-${name}">Page content: ${name}</div>`;
  // }

  // if (args.layout !== '_no_layout') {
  //   lines.push(`<include("${args.layout}/template.marko")>`);
  //   lines.push(`    <@body>`);
  //   lines.push(`        ${pageContent}`);
  //   lines.push(`    </@body>`);
  //   lines.push(`</include>`);
  // } else {
  //   lines.push(pageContent);
  // }
  // vio.save(path.join(targetDir, 'template.marko'), lines);

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

function remove(a1, a2, args) {
  const arr = args.name.split('/');
  const name = _.kebabCase(arr[0]);
  const targetDir = path.join(prjRoot, `src/pages/${name}`);
  vio.del(targetDir);

  // Remove routes
  const routesJsonPath = path.join(prjRoot, 'routes.json');
  let routesJson = JSON.parse(vio.getContent(routesJsonPath));
  routesJson = _.filter(
    routesJson,
    r => !r.route || !new RegExp(`=> ?./src/pages/${name}\$`).test(r.route)
  );
  vio.save(routesJsonPath, JSON.stringify(routesJson, null, 4));

  // Remove i18n
  const i18nDir = path.join(prjRoot, 'locales/en', _.pascalCase(appName));
  const i18nFile = path.join(i18nDir, `${name}.properties`);
  vio.del(i18nFile);
}

module.exports = {
  add,
  remove,
};
