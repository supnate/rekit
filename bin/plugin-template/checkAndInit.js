'use strict';

// Summary:
//  If your plugin needs to initialize when installed, define the logic here.

function checkAndInit() {
  // This method should be able to run multiple times.
  // It should check if already initialized and do correct logic.
  // Rekit will try to checkAndInit before running any Rekit cmd.
}

module.exports = checkAndInit;
