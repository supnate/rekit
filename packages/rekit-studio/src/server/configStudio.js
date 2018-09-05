const _ = require('lodash');
const bodyParser = require('body-parser');
const rekit = require('rekit-core');
const helpers = require('./helpers');

rekit.core.plugin.addPlugin(require('../features/plugin-default/core'));
rekit.core.plugin.addPlugin(require('../features/plugin-terminal/core'));
rekit.core.plugin.addPlugin(require('../features/plugin-cra/core'));

function configStudio(server, app, args) {
  app.use(bodyParser.json({ limit: '5MB' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // app.use((req, res, next) => {
  //   helpers.startOutputToClient();
  //   res.on('finish', () => {
  //     helpers.stopOutputToClient();
  //   });
  //   next();
  // });

  rekit.core.plugin.getPlugins('studio.config').forEach(p => {
    console.log('Loading studio plugin: ', p.name);
    p.studio.config(server, app, args);
  });
}

module.exports = configStudio;
