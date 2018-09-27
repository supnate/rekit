const Watchpack = require('watchpack');

const wp = new Watchpack({
  aggregateTimeout: 100,
  poll: false,
});

wp.watch([], ['/Users/pwang7/workspace/rekit/packages/rekit-studio/src'], Date.now() - 10);

wp.on('aggregated', changes => console.log(changes));
wp.on('change', function(filePath, mtime) {
  console.log('file changed: ', filePath);
});
