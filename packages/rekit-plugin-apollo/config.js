'use strict';

module.exports = {
  accept: ['apollo'],
  defineArgs(addCmd, mvCmd, rmCmd) {
    // Rekit uses argparse for command line args parsing: https://www.npmjs.com/package/argparse
    // Since your plugin uses below commands, defineArgs method allows to define args to the command.
    //   addCmd: rekit add apollo <feature>/<name> [-args]
    //   mvCmd: rekit mv apollo <feature>/<name> [-args]
    //   rmCmd: rekit rm apollo <feature>/<name> [-args]
    // Example  Add "--arg" to the command:
    //   addCmd.addArgument(['--arg'], {
    //     help: 'Description of arg.',
    //   });
    // Then you can use below command to pass the arg:
    //   rekit add apollo home/myElementName --arg argValue
    // Then you can use the arg in apollo.js
  },
};
