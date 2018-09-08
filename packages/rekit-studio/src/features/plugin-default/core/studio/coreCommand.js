module.exports = io => (req, res) => {
  rekit.core.handleCommand(req.body);
  rekit.core.vio.flush();

  rekit.core.vio.reset();
  if (io) io.emit('fileChanged', []);

  res.type('json');
  res.write(JSON.stringify(req.body));
  res.end();
};
