// const Provider = require('service-client-ebay');

const logger = require('logging-inc').logger('${appName}/${name}');

module.exports = {
    ${_.camelCase(name)}(options) {
        logger.info('Service started: ${name}...');
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                logger.info('Service finished: ${name}...');
                resolve({ success: true });
            }, 300);
        });
    }
};
