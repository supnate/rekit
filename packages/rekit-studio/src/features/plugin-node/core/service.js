const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { vio, template, config } = rekit.core;

function add(name, args) {
  name = _.kebabCase(name);
  const tplDir = path.join(__dirname, './templates/service');
  const tplFiles = fs.readdirSync(tplDir);
  const targetDir = `src/services/${name}`;
  vio.mkdir(targetDir);
  tplFiles.forEach(tplFile => {
    const targetPath = `${targetDir}/${tplFile.replace(/\.tpl$/, '')}`;
    template.generate(targetPath, {
      templateFile: path.join(tplDir, tplFile),
      context: { name, appName: config.getPkgJson().name },
    });
  });

  if (args.urlPath) {
    const routesJsonPath = 'routes.json';
    const routesJson = JSON.parse(vio.getContent(routesJsonPath));
    routesJson.unshift({
      route: `GET /${args.urlPath} => ./src/services/${name}/rest`,
      pageName: _.pascalCase(name),
    });

    vio.save(routesJsonPath, JSON.stringify(routesJson, null, 4));
  } else {
    vio.del(path.join(targetDir, 'rest.js'), true);
  }
}

function remove(name, args) {
  name = _.kebabCase(name);
  const targetDir = `src/services/${name}`;
  vio.del(targetDir);

  const routesJsonPath = 'routes.json';
  let routesJson = JSON.parse(vio.getContent(routesJsonPath));
  routesJson = _.filter(
    routesJson,
    r => !r.route || !new RegExp(`=> ?./src/services/${name}/rest\$`).test(r.route)
  );
  vio.save(routesJsonPath, JSON.stringify(routesJson, null, 4));
}


function move(source, target) {
  const name1 = _.kebabCase(source);
  const name2 = _.kebabCase(target);

  // Rename route path if it exists
  const routesJson = JSON.parse(vio.getContent('routes.json'));
  routesJson.forEach(item => {
    if (item.route && item.route.endsWith(`./src/services/${name1}/rest`))
      item.route = item.route.replace(`./src/services/${name1}/rest`, `./src/services/${name2}/rest`);
    if (item.pageName === _.pascalCase(name1)) {
      item.pageName = _.pascalCase(name2);
    }
  });
  vio.save('routes.json', JSON.stringify(routesJson, null, 4));
  // rename dir
  vio.moveDir(`src/services/${name1}`, `src/services/${name2}`);
}


module.exports = { add, remove, move };
