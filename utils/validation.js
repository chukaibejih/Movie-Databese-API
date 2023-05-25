const Joi = require('joi')

const registrationValidation = (data) => {
    const registrationSchema = Joi.object({
        name: Joi.string().min(3).max(200).required(),
        email: Joi.string().min(8).max(200).required(),
        password: Joi.string().min(8).required(),
        age: Joi.number().min(18).required()
    });
    return registrationSchema.validate(data)
}

const loginValidation = (data) => {
    const loginSchema = Joi.object({
        email : Joi.string().min(6).required(),
        password : Joi.string().min(6).required()
    });
    return loginSchema.validate(data)
}

module.exports.registrationValidation = registrationValidation 
module.exports.loginValidation = loginValidation 