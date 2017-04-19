'use strict';

const shell = require('shelljs');

shell.exec('node ./rekit.js --local-portal --local-core')
shell.exec('node ./rekit.js --sass --local-portal --local-core')
shell.exec('node ./plugin.js')
