/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');

var keystone = require('keystone');

var assign = require('object-assign');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
	I tweaked the navlocals to include navlinks.left and navlins.right
	each index in the navlinks is an array that will changed to a list in the template
*/
exports.initLocals = function (req, res, next) {
	var navLinks = {};
	navLinks.left = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Blog', key: 'blog', href: keystone.get('base url')+'blog' },
		{ label: 'Gallery', key: 'gallery', href: keystone.get('base url')+'gallery' },
		{ label: 'Contact', key: 'contact', href: keystone.get('base url')+'contact' },
	];
	navLinks.right = [];
	if(req.user){
		navLinks.right.push({ label: 'Sign Out', href: '/keystone/signout?returnUrl='+req.originalUrl });
		if(req.user.canAccessKeystone)
			navLinks.right.push({ label: 'Open Keystone', href: '/keystone' });
	}else{
		navLinks.right.push({ label: 'Sign In', href: '/keystone/signin?returnUrl='+req.originalUrl });
		navLinks.right.push({ label: 'Create Account', key: 'sign-up', href: keystone.get('base url')+'signup' });
	}
	res.locals.navLinks = navLinks;
	res.locals.user = req.user;
	next();
};

exports.initResponseMethods = function(req,res,next){
	var locals = res.locals;;
	res.notFound = function(data){
		if(data) locals = assign({}, res.locals, data);
		res.status(400).render('errors/404', locals);
	};
	
	res.flashError = function(err, title){
		var error= {};
		error = err.message || err;
		if(title) error.title = title;
		req.flash('error', error);
		res.redirect(req.originalUrl);
	}
}
/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin?returnUrl='+req.originalUrl());
	} else {
		next();
	}
};

exports.errorHandler = function(req,res,next) {
	var statusCode, locals;
	statusCode = res.status() || 200;
	locals = res.locals;
	if(statusCode > 400 && statusCode < 500 ){
		
	}
	if(statusCode > 500){
		
	}
	next();
};