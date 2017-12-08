var url = require('url');
var path = require('path');
var keystoneNodeMailer = require('keystone-nodemailer');

module.exports = function(keystone){
    //set the base url for the current project //
    //sample baseUrl is http://host:8080/blog/ or https://host:4234/blog
    var setBaseUrl = function(){
        var ssl, host, port, protocol, baseUrl;
        ssl = false;
        //use ssl if ssl options are set //
        if(keystone.get('ssl') && (keystone.get('ssl') === "force" || keystone.get('ssl') === "only")){
            ssl = true;
        }
        protocol = (ssl) ? 'https://' : 'http://';
	    host = (ssl) ? keystone.get('ssl host') : keystone.get('host');
        port = (ssl) ? keystone.get('ssl port') : keystone.get('port');
        baseUrl = protocol + host + ":" + port + '/';
        return url.format(baseUrl);
    }
    //add the baseUrl in keystone options table //
    keystone.set('base url', setBaseUrl());

    //set an error handler for server 500 errors //
    keystone.set('500', function(err, req, res, next){
        var dashes = '\n------------------------------------------------\n';
        var locals, errMessage;

        locals = res.locals;
        res.status(500);
        //if we are not in production, add detailed error message //
        if(keystone.get('env') !== "production"){
            locals.error = err;
        }
        if(keystone.get('logger')){
            if (err instanceof Error) {
				console.log((err.type ? err.type + ' ' : '') + 'Error thrown for request: ' + req.url);
			} else {
				console.log('Error thrown for request: ' + req.url);
			}
			console.log(err.stack || err);
        }
        //return json data if the accept header is json //
        if (req.headers.accept === 'application/json') {
            return res.json({ 
                error: 'Internal Server error',
                message: err.message || "",
                stack: err.stack || {}, 
                details: err
             });
        }
        //render a 500 template page for server errors //
        res.render('errors/500', locals);
        
    });

    keystone.set('404', function(req,res,next){
        var locals;
        res.status(404);
        locals = res.locals;
        locals.url = req.originalUrl;
        //render a 400 template page, this is found in templates/views/errors/400.pug //
        res.render('errors/404',locals);
    });
    //set the default email transport method //
    keystone.set('email transport', 'nodemailer');

    keystone.set('email config', {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        logger: true,
        debug: true,
        auth:{
            type: 'OAuth2',
            clientId: process.env.SMTP_CLIENT_ID,
            clientSecret: process.env.SMTP_CLIENT_SECRET,
            user: process.env.SMTP_USERNAME,
            refreshToken: process.env.SMTP_REFRESH_TOKEN,
            accessToken: process.env.SMTP_ACCESS_TOKEN
        }
    });

    

    var email = keystone.Email({
        templateName:'sample-email',
        transport: ''
    });
    /*email.send({
        from: 'rmoayinla@gmail.com',
        inline_css: true,
        nodemailerConfig: keystone.get('email config'),
        to: 'rmoayinla@yahoo.com'
    }, function(err){
        if(err) {
            console.log('Error occured while sending mail: %s', err);
            return; 
        }
        console.log("Mail sent succesfully");
    });*/

};