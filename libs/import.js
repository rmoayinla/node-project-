var path = require('path');
var is = require('is');
var fs = require('fs');

module.exports = function (dirname,keystone) {
    
        var initialPath = dirname;
    
        var doImport = function (fromPath, app) {
    
            var imported = {};
    
            fs.readdirSync(fromPath).forEach(function (name) {
    
                var fsPath = path.join(fromPath, name);
                var info = fs.statSync(fsPath);
    
                // recur
                if (info.isDirectory()) {
                    imported[name] = doImport(fsPath);
                } else {
                    // only import files that we can `require`
                    var ext = path.extname(name);
                    var base = path.basename(name, ext);
                    if (require.extensions[ext]) {
                        if(name !== 'index.js' && name !== 'import.js'){
                            imported[name] = require(fsPath);
                            fireEvent(imported,name,keystone);
                        }
                    }
                }
    
            });
    
            return imported;
        };
    
        return doImport(initialPath, keystone);
};

function fireEvent (events,name,keystone) {
    if (typeof events[name] === 'function') {
        events[name](keystone);
    }
}