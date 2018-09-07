
module.exports = (req, res, next) => {
  res.type('json');
  res.write(JSON.stringify(rekit.core.app.getProjectData()));
  res.end();
};
