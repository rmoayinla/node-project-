var 
    keystone = require('keystone'),
    extend = require('extend'),
    path = require('path');

exports = module.exports = function(req, res){
    var view, locals,userModel, formData, formErrors;

    view = new keystone.View(req, res);
    locals = res.locals;
    userModel = keystone.list(keystone.get('user model'));

    //mark the navbar link active with ".active" class, @see templates/partials/navbar.pug//
    locals.section = 'sign-up';

    formData = {username:'', firstname: '', lastname: '', email: '', password:'',};
    formErrors = formData;

    //adds the entered datas and error messages to locals //
    //locals will be passed to the rendered template //
    view.on('init', function(next){
        locals.form = extend({}, formData, req.body);
        locals.error = {};
        next();
    });


    view.on('get', function(next){
        //redirect user to the admin page if we have someone logged in//
        if(req.user) res.redirect('/keystone');
        next();
    });

    //render the signup page containing the signup form in template/views/auth/signup.pug //
    view.render('auth/signup');


};