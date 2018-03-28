/* eslint no-restricted-globals: 0, prefer-spread: 0, no-continue: 0, no-use-before-define: 0 */
/* global self, babylon */
self.importScripts(['/static/libs/babylon.js']);

// Respond to message from parent thread
self.addEventListener('message', event => {
  const { code } = event.data;
  try {
    const ast = babylon.parse(code, {
      // parse in strict mode and allow module declarations
      sourceType: 'module',
      plugins: [
        'jsx',
        'flow',
        'doExpressions',
        'objectRestSpread',
        'decorators',
        'classProperties',
        'exportExtensions',
        'asyncGenerators',
        'functionBind',
        'functionSent',
        'dynamicImport',
      ],
    });
    console.log(ast);
    self.postMessage({ });
  } catch (e) {
    /* Ignore error */
  }
});
