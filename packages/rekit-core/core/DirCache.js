const Watchpack = require('watchpack');

function DirCache(dirs, options) {
  const listeners = [];
  this.getContent();
  this.on = function() {};
  this.kill = function() {};
}

module.exports = DirCache;
