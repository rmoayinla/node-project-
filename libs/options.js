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