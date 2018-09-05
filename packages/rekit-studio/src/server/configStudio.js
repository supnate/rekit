const _ = require('lodash');
const bodyParser = require('body-parser');
const rekit = require('rekit-core');
const chalk = require('chalk');
const expressWs = require('express-ws');
const helpers = require('./helpers');

rekit.core.plugin.addPlugin(require('../features/plugin-default/core'));
rekit.core.plugin.addPlugin(require('../features/plugin-terminal/core'));
rekit.core.plugin.addPlugin(require('../features/plugin-cra/core'));

function setupSocketIo(server) {
  const io = require('socket.io')(server);

  io.on('connection', client => {
    client.on('disconnect', () => {
      console.log('socket disconnected');
    });
  });

  io.on('error', err => {
    console.log('socket error', err);
  });
  return io;
}

function configStudio(server, app, args) {
  args = args || {};
  expressWs(app, server);
  app.use(bodyParser.json({ limit: '5MB' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  const io = setupSocketIo(server);
  args.io = io;
  app.use((req, res, next) => {
    helpers.startOutputToClient(io);
    res.on('finish', () => {
      helpers.stopOutputToClient();
    });
    next();
  });

  rekit.core.plugin.getPlugins('studio.config').forEach(p => {
    console.log('Loading studio plugin: ', p.name);
    p.studio.config(server, app, args);
  });

  // General error handler
  app.use(function(err, req, res, next) {
    if (res.headersSent) {
      next(err);
      return;
    }
    res.statusCode = 500;
    res.write(err.message || 'Unknown error');
    res.write('\n');
    if (err.stack) {
      res.write(err.stack);
      err.stack.split('\n').forEach(line => console.log(chalk.red(line)));
    }
    res.end();
  });
}

module.exports = configStudio;
