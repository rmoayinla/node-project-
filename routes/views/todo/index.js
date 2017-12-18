var keystone = require('keystone');
exports = module.exports = function (req, res) {
    var view, locals;

    view = new keystone.View(req, res);
    locals = res.locals;
    locals.title = 'Todos';
    
    view.render('todo/index');
};