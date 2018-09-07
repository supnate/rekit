const path = require('path');
const CLIEngine = require('eslint').CLIEngine;

function lint(req, res) {
  const code = req.body.content;
  const file = rekit.core.paths.map(req.body.file);
  const cli = new CLIEngine({
    cwd: path.dirname(file),
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
