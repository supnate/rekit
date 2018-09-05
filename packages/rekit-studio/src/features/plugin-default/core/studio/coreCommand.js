const rekit = require('rekit-core');

module.exports = (req, res) => {
  res.type('json');
  rekit.core.handleCommand(req.body);
  rekit.core.vio.flush();
  res.write(JSON.stringify(req.body));
  res.end();
};
