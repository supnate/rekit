const rekit = require('rekit-core');

module.exports = (req, res) => {
  const args = req.body;
  switch (args.action) {
    case 'add':
      rekit.core.element.add(args.elementType, args.params.name, args.params);
      break;
    case 'move':
      rekit.core.element.move(args.elementType, args.params.name, args.params);
      break;
    case 'remove':
      rekit.core.element.remove(args.elementType, args.params.name, args.params);
      break;
    default:
      break;
  }

  res.setHeader('content-type', 'application/json');
  res.write(JSON.stringify(args));
  res.end();
};
