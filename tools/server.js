'use strict';

const path = require('path');
const webpack = require('webpack');
const express = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const pkgJson = require('../package.json');
const config = require('../webpack-config')('dev');

pkgJson.rekit = pkgJson.rekit || {
  devPort: 6076,
  buildPort: 6077,
  css: 'less', // scss | less | css
};

const app = express();
const compiler = webpack(config);

app.use(devMiddleware(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
}));

app.use(hotMiddleware(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(pkgJson.rekit.devPort, (err) => {
  if (err) {
    console.error(err);
  }

  console.log(`Listening at http://localhost:${pkgJson.rekit.devPort}/`);
});
