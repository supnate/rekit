const _ = require('lodash');
const rekit = require('rekit-core');

const { paths, vio } = rekit.core;

module.exports = (req, res) => {
  const file = req.query.file;
  const absPath = paths.map(file);
  if (!_.startsWith(absPath, paths.getProjectRoot())) {
    res.statusCode = 403;
    res.write('Forbidden: not allowed to access file out of the project.');
    res.end();
  }

  if (!vio.fileExists(file)) {
    res.statusCode = 404;
    res.write(JSON.stringify({ error: 'Not found.' }));
    res.end();
  } else {
    res.write(JSON.stringify({ content: vio.getContent(file) }));
    res.end();
  }
};
