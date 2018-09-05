const rekit = require('rekit-core');
const watchFileChange = require('./studio/watch');
const lint = require('./studio/lint');

function config(server, app, args) {
  watchFileChange(args.io);

  app.get('/api/project-data', (req, res, next) => {
    res.type('json'); 
    res.write(JSON.stringify(rekit.core.app.getProjectData()));
    res.end();
  });

  app.post('/api/core-command', (req, res) => {
    res.type('json');
    rekit.core.handleCommand(req.body);
    rekit.core.vio.flush();
    res.write(JSON.stringify(req.body));
    res.end();
  });

  app.post('/api/lint', lint);
}

module.exports = { config };
