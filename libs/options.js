var url = require('url');
module.exports = function(keystone){
    
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
    keystone.set('base url', setBaseUrl());

    keystone.set('500', function(err, req, res, next){
        var dashes = '\n------------------------------------------------\n';
        var view, locals, errMessage;

        locals = res.locals;
        res.status(500);
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
        res.render('errors/500', locals);
        
    });
    

};