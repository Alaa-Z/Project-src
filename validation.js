
// VALIDATION 
const Joi = require('@hapi/joi');

// VALIDATE REGISTER 
const registerValidation =  (data) => {
    const schema = Joi.object(
        {
            name: Joi.string().min(2).max(255).required(),
            email: Joi.string().min(6).required().max(255).email(),
            password: Joi.string().min(6).max(1024).required() 
        }
    );
    return schema.validate(data)
}

const loginValidation =  (data) => {
    const schema = Joi.object(
        {
            email: Joi.string().min(6).required().max(255).email(),
            password: Joi.string().min(6).max(1024).required() 
        }
    );
    return schema.validate(data)
}
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;