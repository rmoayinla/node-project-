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
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Blog', key: 'blog', href: keystone.get('base url')+'blog' },
		{ label: 'Gallery', key: 'gallery', href: keystone.get('base url')+'gallery' },
		{ label: 'Contact', key: 'contact', href: keystone.get('base url')+'contact' },
	];
	res.locals.user = req.user;
	next();
};

exports.initResponseMethods = function(req,res,next){
	var locals = assign({}, res.locals, data);
	res.notFound = function(data){
		res.status(400).render('errors/404', locals);
	};
	
	res.serverError = function(err, title){
		var error;
		error = err.message || err;
		if(title) error.title = title;
		req.flash('error', error);
		res.redirect(req.originalUrl());
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
		return res.render('errors/404', locals);
	}
	if(statusCode > 500){
		return res.render('errors/500', locals);
	}
	next();
};