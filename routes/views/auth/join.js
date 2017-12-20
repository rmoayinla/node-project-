var 
    keystone = require('keystone');

exports = module.exports = function(req, res){
    var view, locals,userModel;
    view = new keystone.View(req, res);
    locals = res.locals;
    userModel = keystone.list('Y');
    locals.section = 'sign-up';

    view.on('init', function(next){
        locals.form = req.body || {};
        next();
    });

    view.on('post', function(next){
        var userData;
        userData = req.body;
    });

    view.on('get', function(next){
        //redirect user to the admin page if we have someone logged in//
        if(req.user) res.redirect('/keystone');
        next();
    });

    //render the signup page containg the signup form in template/views/auth/signup.pug //
    view.render('auth/signup');
};