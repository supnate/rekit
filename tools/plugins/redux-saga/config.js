'use strict';

module.exports = {
  accept: ['action'],
  defineArgs(addCmd, mvCmd, rmCmd) { // eslint-disable-line
    // Rekit uses argparse for command line args parsing: https://www.npmjs.com/package/argparse
    // Here you can add options for you plugin when running rekit commands
    //  rekit add/rm/mv
    addCmd.addArgument(['--thunk'], {
      help: 'Use redux-thunk for async action.',
      action: 'storeTrue',
    });
  },
};
