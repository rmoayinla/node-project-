// Simple module to include all js files in the lib folder 
// the main importing module is found in import.js
//this file only require the import.js which loads all js modules in the lib folder
//the import is recursive i.e. modules in inner folders will be loaded too 

var importLibs = require('./import');
var path = require('path');

module.exports = function(keystone){
    
    var dirname = path.dirname(__filename);
    
    return importLibs(dirname, keystone);
    
}