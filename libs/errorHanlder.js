module.exports= function(keystone){
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
                detail: err
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
};