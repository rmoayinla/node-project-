require('es6-promise').polyfill();
var 
    keystone = require('keystone'),
    async = require('async'),
    extend = require('extend');

exports = module.exports = function(req, res){
    var view, locals,userModel, formData, formErrors;
    view = new keystone.View(req, res);
    locals = res.locals;
    userModel = keystone.list('Y');
    //mark the navbar link active with ".active" class, @see templates/partials/navbar.pug//
    locals.section = 'sign-up';

    formData = {username:'', firstname: '', lastname: '', email: '', password:'',};
    formErrors = formData;

    view.on('init', function(next){
        locals.form = extend({}, formData, req.body);
        locals.error = formErrors;
        next();
    });

    view.on('post', function(next){
        var userData;
        userData = req.body;
        /*async.series([
			
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
                console.log('Error creating user, error:%s', e);
				next();
			}
			
			keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
			
        });*/
        checkFormData(userData)
            .then(function checkUsernameExists(data){
                return new Promise(function(resolve, reject){
                    keystone.list('Y').model.findOne({ username: data.username }, function(err, user) {
                    
                        if (err || user) {
                            reject(new Error('User already exists with that Username.'), err);
                        }
                        
                        resolve(data);
                        
                    });
                });
            })
            .then(function checkEmailExists(data){
                return new Promise(function(resolve, reject){
                    keystone.list('Y').model.findOne({ email: data.email }, function(err, user) {
                    
                        if (err || user) {
                            reject(new Error('User already exists with that email address.'));
                        }
                        
                        resolve(data);
                        
                    });
                });
            })
            .then(function createUser(data){
                return new Promise(function(resolve, reject){
                    var newUserData = {
                        username: data.username,
                        name: {
                            first: data.firstname,
                            last: data.lastname,
                        },
                        email: data.email,
                        password: data.password
                    };
                    
                    var User = keystone.list('Y').model,
                        newUser = new User(newUserData);
                    
                    newUser.save(function(err) {
                        if(err) reject(new Error('Error creating new user'), err );
                        resolve("success");
                    });     
                    
                });
            })
            .catch(function handleError(message, err){
                req.flash('error', message);
                if(err) console.log('User could not be created: %o', err);
                next();
            });
        
    });

    view.on('get', function(next){
        //redirect user to the admin page if we have someone logged in//
        if(req.user) res.redirect('/keystone');
        next();
    });

    //render the signup page containing the signup form in template/views/auth/signup.pug //
    view.render('auth/signup');

    function checkFormData(data){
        return new Promise(function(resolve, reject){
            if (!data.username || !data.firstname || !data.lastname || !data.email || !data.password) {
                reject( new Error( 'Please enter a username, your name, email and password.'), true);
            }
            resolve(data);
        });
    }
    

    

    

 

};

