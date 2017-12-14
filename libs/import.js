//importer module based on keystone keystone.import
//loads all importable modules in folders and inner folders using node fs 

var path = require('path');
var is = require('is');
var fs = require('fs');

module.exports = function (dirname,keystone) {
    
    var doImport = function (fromPath, app) {
        var imported = {};
        var parentDir = true;
        //read everything in the pass directory i.e. both files and dirs and loop through each //
        fs.readdirSync(fromPath).forEach(function (name) {
                //create a directory path by joining the curring index with the parent dir //
                var fsPath = path.join(fromPath, name);
                
                //get the file details to know if its a dir or normal file //
                var info = fs.statSync(fsPath);
    
                // recur
                if (info.isDirectory()) {
                    imported[name] = doImport(fsPath);
                    parentDir = false;
                } else {
                    // only import files that we can `require`
                    var ext = path.extname(name);
                    var base = path.basename(name, ext);
                    if (require.extensions[ext]) {
                        //skip some certain files e.g. index.js and import.js
                        if(parentDir && (name !== 'index.js' || name !== 'import.js')){
                            imported[name] = require(fsPath);
                            loadModule(imported,name,keystone);
                        }
                    }
                }
    
            });
    
            return imported;
        };
    
        return doImport(dirname, keystone);
};

function loadModule (events,name,keystone) {
    if (typeof events[name] === 'function') {
        events[name](keystone);
    }
}