'use strict';

module.exports = {
  accept: ['action'],
  defineArgs(addCmd, mvCmd, rmCmd) { // eslint-disable-line
    addCmd.addArgument(['--thunk'], {
      help: 'Use redux-thunk for async actions.',
      action: 'storeTrue',
    });
  },
};
