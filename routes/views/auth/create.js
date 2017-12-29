require('es6-promise').polyfill();
var 
    keystone = require('keystone'),
    extend = require('extend'), 
    forEach = require('foreach');
    const { check, validationResult } = require('express-validator/check');
    const { matchedData, sanitize } = require('express-validator/filter');

module.exports = function(req, res, next){
    var view, formData, formErrors, userModel, locals; 
    view = new keystone.View(req, res);
    locals = res.locals;
    
    formData = {username:'', firstname: '', lastname: '', email: '', password:'',};
    formErrors = {};

    

    view.on('post', function(next){
        var userData;
        userData = req.body;
        formErrors = validationResult(req);
        checkFormData(userData)
            .then(function(data){
                return new Promise(function(resolve, reject){
                   if(!formErrors.isEmpty()) {
                       reject('Error occured while validating');
                       return;
                   }
                   
                   resolve('success')
                });
            })
            .then(function(){
                next();
            })
            /*.then(function checkUsernameExists(data){
                return new Promise(function(resolve, reject){
                    userModel.model.findOne({ username: data.username }, function(err, user) {
                    
                        if (err || user) {
                            formErrors.username = 'User already exists with that Username';
                            reject(new Error('User already exists with that Username.'), err);
                        }
                        
                        resolve(data);
                        
                    });
                });
            })
            .then(function checkEmailExists(data){
                return new Promise(function(resolve, reject){
                    userModel.model.findOne({ email: data.email }, function(err, user) {
                    
                        if (err || user) {
                            formErrors.email = 'User already exists with that email address';
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
                    
                    var User = userModel.model,
                        newUser = new User(newUserData);
                    
                    newUser.save(function(err) {
                        if(err) reject(new Error('Error creating new user'), err );
                        resolve("success");
                    });     
                    
                });
            })
            .then(function signInUser(status){
                return new Promise(function(resolve, reject){
                    var onSuccess, OnFailure;
                    onSuccess = function(){
                        resolve('success');
                        res.redirect('/keystone');
                    } 
                    onFailure = function(e){
                        reject(e, new Error('Unable to signin user'));
                    }
                    keystone.session.signin(
                        { email: req.body.email, password: req.body.password }, 
                        req, 
                        res,
                        onSuccess, 
                        onFailure
                    );
                });
                
            })*/
            .catch(function handleError(message, err){
                req.flash('error', message);
                locals.form = extend({}, req.body, formData);
                var errors = {}, obj = {}; 
                errors = Array.from(formErrors.array());
                errors.map(function(v, i){
                    var param, msg; 
                    param = v.param;
                    msg = v.msg;
                    obj[param] = msg;
                });
                locals.errors = obj;
                
                
                next();
            });
        
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

}