const service = require('./index');
const logger = require('logging-inc').logger('${appName}/${name}');

module.exports = function(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    service.${_.camelCase(name)}().then(result => {
        res.write(JSON.stringify(result || {}));
        res.end();
    }).catch(e => {
        res.statusCode = 500;
        res.write('Request failed.');
        logger.error('Rest API failed: ' + e.toString());
        res.end();
    });
};
