var path = require('path');
var utils = require('util');
var is = require('is');
var _ = require('lodash');
var importLibs = require('./import');
module.exports = function(keystone){
    var folder;
    
    var dirname = path.dirname(__filename);
    var libs = importLibs(dirname, keystone);
    
    console.log('inspecting:%s', utils.inspect(libs));
}