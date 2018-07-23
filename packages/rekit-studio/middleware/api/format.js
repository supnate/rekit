'use strict';

const path = require('path');
const prettier = require('prettier');
const Watchpack = require('watchpack');
const rekit = require('rekit-core');

const PRETTIER_CONFIG_FILES = [
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.yaml',
  '.prettierrc.yml',
  '.prettierrc.js',
  'package.json',
  'prettier.config.js',
];

const DEFAULT_PRETTIER_OPTIONS = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 120,
};

const wp = new Watchpack({
  // options:
  aggregateTimeout: 10,
  // fire "aggregated" event when after a change for 1000ms no additonal change occured
  // aggregated defaults to undefined, which doesn't fire an "aggregated" event

  poll: false,
  // poll: true - use polling with the default interval
  // poll: 10000 - use polling with an interval of 10s
  // poll defaults to undefined, which prefer native watching methods
  // Note: enable polling when watching on a network path
});
// Watchpack.prototype.watch(string[] files, string[] directories, [number startTime])
// Watch src files change only
wp.watch(PRETTIER_CONFIG_FILES.map(f => path.join(rekit.core.paths.getProjectRoot(), f)), [], Date.now() - 10);

wp.on('aggregated', () => {
  prettier.clearConfigCache();
});

function format(req, res) {
  const content = req.body.content;
  const file = path.join(rekit.core.paths.getProjectRoot(), req.body.file);

  prettier
    .resolveConfig(file)
    .then(options => {
      try {
        const formatted = prettier.formatWithCursor(
          content,
          Object.assign({ filepath: file, cursorOffset: req.body.cursorOffset }, options || DEFAULT_PRETTIER_OPTIONS)
        );
        res.write(JSON.stringify({ content: formatted }));
      } catch (err) {
        console.log('Failed to format code: ', err);
        res.write(JSON.stringify({ content, error: 'Failed to format code.', err }));
      }
      res.end();
    })
    .catch(err => {
      res.write(
        JSON.stringify({
          content,
          error: 'Failed to resolve prettier config.',
          err,
        })
      );
      res.end();
    });
}
module.exports = format;
