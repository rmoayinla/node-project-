var 
    keystone = require('keystone');

exports = module.exports = function(req, res){
    var view, locals,userModel;
    view = new keystone.View(req, res);
    locals = res.locals;
    userModel = keystone.list('Y');
    locals.section = 'sign-up';
    view.on('post', function(next){
        locals.form = req.body;
    });

    //render the signup page containg the signup form in template/views/auth/signup.pug //
    view.render('auth/signup');
};