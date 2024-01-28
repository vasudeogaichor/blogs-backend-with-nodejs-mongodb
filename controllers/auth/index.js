const userLogin = require('./userLogin');
const userRequestResetToken = require('./userRequestResetToken');
const userVerifyResetToken = require('./userVerifyResetToken');
const userRegister = require('./userRegister');
const userValidateToken = require('./userValidateToken');

module.exports = {
    userLogin,
    userRequestResetToken,
    userRegister,
    userVerifyResetToken,
    userValidateToken
}