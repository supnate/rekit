'use strict';

// Start Rekit Studio
const path = require('path');
const http = require('http');
const express = require('express');
const rekitStudioMiddleWare = require('rekit-studio/middleware');
const fallback = require('express-history-api-fallback');

function startRekitStudio(port) {
  console.log('Starting Rekit Studio...');
  return new Promise((resolve, reject) => {
    const app = express();
    const server = http.createServer(app);
    const root = path.join(__dirname, '../node_modules/rekit-studio/dist');
    app.use(rekitStudioMiddleWare()(server, app));
    app.use(express.static(root));
    app.use(fallback('index.html', { root }));

    // Other files should not happen, respond 404
    app.get('*', (req, res) => {
      console.log('Warning: unknown req: ', req.path);
      res.sendStatus(404);
    });

    server.listen(port, err => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      console.log(`Rekit Studio is running at http://localhost:${port}/`);
      resolve();
    });
  });
}

module.exports = startRekitStudio;
