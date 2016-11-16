'use strict';

// Summary:
//  Parse args for Rekit command line tools.

const program = require('commander');

function splitSlash(arg) {
  const arr = arg.split('/');
  return {
    feature: arr[0],
    name: arr[1],
  };
}

module.exports = {
  parse1() {
    // Parse args for adding/removing components or pages.
    program
      .option('-c, --component <feature>/<name>', 'Add component.', splitSlash)
      .option('-p, --page <feature>/<name>', 'Add page.', splitSlash)
      .option('-a, --action <feature>/<name>', 'Add action.', splitSlash)
      .option('-A, --async-action <feature>/<name>', 'Add async action.', splitSlash)
      .option('-t, --test <feature>/<name>', 'Add test.', splitSlash)
      .option('-u, --url-path <url-path>', 'Add url path for page.')
      .option('-T, --action-type <action-type>', 'Action type for sync action.')
      .parse(process.argv);
    return program;
  },
};
