const rekit = require('rekit-core');
export function (req, res) {
  const args = req.body;
  res.setHeader('content-type', 'application/json');
  res.write(
    JSON.stringify(
      args
    )
  );
  res.end();
}
