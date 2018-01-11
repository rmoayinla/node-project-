const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

module.exports.validateUsername = function(username, message, isEmail){
    var valid = check(username).exists().withMessage(message);
    if(isEmail)
        valid.isEmail().withMessage('Username has to be a valid email address');
    return valid;
}

module.exports.validatePassword = function(password, message, lenght, match){
    var valid = check(password).exists().withMessage(message);
    if(lenght)
        valid.isLength({min: lenght}).withMessage(`Password has to be ${lenght} characters long`);
    if(match)
        valid.matches(new RegExp(match, 'i')).withMessage('Password does not match the pattern');
    return valid;
}

module.exports.validateFields = function(fields, message){
    var validate = function(field){
        var valid = check(field).exists().withMessage(`${field} is required. ${message}`);
        return valid;
    }
    if(Array.isArray(fields)){
        fields.forEach(function(field){
            validate(field);
        });
    }else{
        return validate(fields);
    }
}

module.exports.validationErrors = function(req){
    return validationResult(req);
}

module.exports.validFields = function(req){
    return matchedData(req);
}