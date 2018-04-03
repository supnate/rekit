'use strict';

module.exports = {
  accept: [],
  defineArgs(addCmd, mvCmd, rmCmd) {
    addCmd.addArgument(['--apollo'], {
      help: 'Add a component with Apollo client.',
      action: 'storeTrue',
    });
  },
};
