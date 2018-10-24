const path = require('path');
const http = require('http');
const express = require('express');
const compression = require('compression');
const fallback = require('express-history-api-fallback');
const configStudio = require('./configStudio');

function start(options) {
  const app = express();
  const server = http.createServer(app);
  const studioRoot = path.join(__dirname, '../build');
  app.use(compression());
  app.use(express.static(studioRoot)); // access files in Rekit Studio
  app.use(express.static(options.projectRoot)); // access files in project

  (options.plugins || []).forEach(plugin => {
    // serve static content in plugin folder
    app.use(`/plugin-${plugin.name}`, express.static(plugin.root));
  });

  configStudio(server, app);
  app.use(fallback('index.html', { root: studioRoot }));

  const port = options.port;
  server.listen(parseInt(port, 10), err => {
    if (err) {
      console.error(err);
    }

    console.log(`Rekit Studio is running at http://localhost:${port}/`);
  });
}

module.exports = start;
