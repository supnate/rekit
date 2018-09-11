const template = require('marko').load(require.resolve('./template.marko'));

module.exports = function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    const viewModel = {};
    template.render(viewModel, res);
};
