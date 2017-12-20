var 
    keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res){
    var view, locals,userModel;
    view = new keystone.View(req, res);
    locals = res.locals;
    userModel = keystone.list('Y');
    //mark the navbar link active with ".active" class, @see templates/partials/navbar.pug//
    locals.section = 'sign-up';

    view.on('init', function(next){
        locals.form = req.body || {};
        next();
    });

    view.on('post', function(next){
        var userData;
        userData = req.body;
        async.series([
			
			function(cb) {
				
				if (!userData.username || !userData.firstname || !userData.lastname || !userData.email || !userData.password) {
					req.flash('error', 'Please enter a username, your name, email and password.');
					return cb(true);
				}
				
				return cb();
				
			},
            
            function(cb) {
				
				keystone.list('Y').model.findOne({ username: userData.username }, function(err, user) {
					
					if (err || user) {
						req.flash('error', 'User already exists with that Username.');
						return cb(true);
					}
					
					return cb();
					
				});
				
			},
			
			function(cb) {
				
				keystone.list('Y').model.findOne({ email: userData.email }, function(err, user) {
					
					if (err || user) {
						req.flash('error', 'User already exists with that email address.');
						return cb(true);
					}
					
					return cb();
					
				});
				
			},
			
			function(cb) {
			
				var newUserData = {
                    username: userData.username,
					name: {
						first: userData.firstname,
						last: userData.lastname,
					},
					email: userData.email,
					password: userData.password
				};
				
				var User = keystone.list('Y').model,
					newUser = new User(newUserData);
				
				newUser.save(function(err) {
					return cb(err);
				});
			
			}
			
		], function(err){
			
			if (err) {
                locals.form = userData;
                return next();
            }
			
			var onSuccess = function() {
 					res.redirect('/keystone');
			}
			
			var onFail = function(e) {
                req.flash('error', 'There was a problem signing you up, please try again.');
                locals.form = userData;
				return next();
			}
			
			keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
			
		});
    });

    view.on('get', function(next){
        //redirect user to the admin page if we have someone logged in//
        if(req.user) res.redirect('/keystone');
        next();
    });

    //render the signup page containing the signup form in template/views/auth/signup.pug //
    view.render('auth/signup');
};