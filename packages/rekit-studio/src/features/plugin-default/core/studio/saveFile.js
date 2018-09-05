const _ = require('lodash');
const rekit = require('rekit-core');

const { paths, vio } = rekit.core;

module.exports = (req, res) => {
  const file = req.body.file;
  const absPath = paths.map(file);
  if (!_.startsWith(absPath, paths.getProjectRoot())) {
    // prevent ../.. in req.query.file
    res.statusCode = 403;
    res.write('Forbidden: not allowed to access file out of the project.');
    res.end();
  }

  if (!vio.fileExists(file)) {
    res.statusCode = 404;
    res.write(JSON.stringify({ error: 'Not found.' }));
    res.end();
  } else {
    try {
      vio.put(file, req.body.content);
      res.write(JSON.stringify({ success: true }));
    } catch (err) {
      res.write(JSON.stringify({ error: err }));
    }
    res.end();
  }
};
