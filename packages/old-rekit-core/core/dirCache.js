const Watchpack = require('watchpack');
const app = require('./app');

function DirCache(dir, options) {
  const listeners = [];
  let files = null;
  this.getFiles = function() {
    if (!files) {
      files = app.readDir(dir);
    }
    return files;
  };

  const wp = (this.wp = new Watchpack({
    aggregateTimeout: 100,
    poll: false,
  }));
  wp.watch([], [dir], Date.now() - 10);

  wp.on('changee', changes => {});
  this.on = function() {};
  this.kill = function() {};
}

module.exports = DirCache;
