const rekit = require('rekit-core');
const Watchpack = require('watchpack');

const { paths, vio } = rekit.core;

function watchFileChange(io) {
  const wp = new Watchpack({
    aggregateTimeout: 1000,
    poll: false,
    // TODO: make ignored configurable
    ignored: /node_modules|\.git/,
  });

  // TODO: make watch dir configurable
  wp.watch([], [paths.map('src'), paths.map('tests'), paths.map('coverage')], Date.now() - 10);

  wp.on('aggregated', changes => {
    vio.reset();
    if (io) io.emit('fileChanged', changes);
  });
}

module.exports = watchFileChange;
