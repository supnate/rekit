const rekit = require('rekit-core');

function config(server, app, args) {
  app.get('/api/project-data', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(rekit.core.app.getProjectData()));
    res.end();
  });

  app.post('/api/core-command', (req, res) => {
    res.setHeader('content-type', 'application/json');
    rekit.core.handleCommand(req.body);
    rekit.core.vio.flush();
    res.write(JSON.stringify(req.body));
    res.end();
  });
}

module.exports = { config };
