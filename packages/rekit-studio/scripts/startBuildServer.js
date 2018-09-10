const http = require('http');
const path = require('path');
const express = require('express');
const compression = require('compression');
const configStudio = require('../src/server/configStudio');
const fallback = require('express-history-api-fallback');

function startBuildServer() {
  const app = express();
  const server = http.createServer(app);
  const root = path.join(__dirname, '../build');
  app.use(compression());
  app.use(express.static(root));
  configStudio(server, app);
  app.use(fallback('index.html', { root }));

  // const port = args.build_port || pkgJson.rekit.buildPort;
  const port = 6079;
  server.listen(port, err => {
    if (err) {
      console.error(err);
    }

    console.log(`The build server is listening at http://localhost:${port}/`);
  });
}

startBuildServer();

module.exports = startBuildServer;
