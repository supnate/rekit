const watchFileChange = require('./watch');
const lint = require('./lint');
const projectData = require('./projectData');
const coreCommand = require('./coreCommand');
const readFile = require('./readFile');
const saveFile = require('./saveFile');

function config(server, app, args) {
  watchFileChange(args.io);

  app.get('/api/project-data', projectData);
  app.post('/api/core-command', coreCommand(args.io));
  app.post('/api/lint', lint);
  app.get('/api/read-file', readFile);
  app.post('/api/save-file', saveFile);
}

module.exports = { config };
