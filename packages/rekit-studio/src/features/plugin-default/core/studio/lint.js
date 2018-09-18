const path = require('path');
const importFrom = require('import-from');


function lint(req, res) {
  const code = req.body.content;
  const file = rekit.core.paths.map(req.body.file);
  const cwd = path.dirname(file);
  const CLIEngine = importFrom(cwd, 'eslint').CLIEngine;

  const cli = new CLIEngine({
    cwd,
  });
  try {
    const messages = cli.executeOnText(code, file).results[0].messages;
    res.write(JSON.stringify(messages));
  } catch (err) {
    // Do nothing if lint error
    res.write(JSON.stringify({ error: err }));
  }
  res.end();
}

module.exports = lint;
