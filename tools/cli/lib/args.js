'use strict';

// Summary:
//  Parse args for Rekit command line tools.

const program = require('commander');

module.exports = {
  parse1() {
    // Parse args for adding/removing components or pages.
    let feature, component, urlPath;
    program
      .arguments('<component> [urlPath]')
      .action((arg1, arg2) => {
        const arr = arg1.split('/');
        feature = arr[0];
        component = arr[1];
        urlPath = arg2;
      })
      .parse(process.argv);

    return { feature, component, urlPath };
  },
};
