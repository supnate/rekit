const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const PORT = require('../package.json').buildTestServerPort;

const config = {
  context: path.join(__dirname, '../build'),
  output: {
    path: path.join(__dirname, '../build'),
  },
};

new WebpackDevServer(webpack(config), {
  contentBase: path.join(__dirname, '../build'),
  noInfo: false,
  https: false,
  historyApiFallback: true,
}).listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Build test server listening at http://localhost:${PORT}`);
});
