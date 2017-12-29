const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
module.exports = [
    check('password').isLength({min: 8}).withMessage('Not long enough'),
    check('email').isEmail().withMessage('Email address has to be a valid email'),
];