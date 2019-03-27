const paths = require('../core/paths');
const logger = require('../core/logger');

paths.setProjectRoot(paths.join(__dirname, './test-prj'));
logger.setSilent(true);
