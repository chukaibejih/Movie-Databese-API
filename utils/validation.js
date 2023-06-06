const Joi = require('joi')

const registrationValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(200).required(),
        email: Joi.string().min(8).max(200).required(),
        password: Joi.string().min(8).required(),
        age: Joi.number().min(18).required(),
        role: Joi.string().required().valid("user", "admin", "super_admin")
    });
    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email : Joi.string().min(6).required(),
        password : Joi.string().min(6).required()
    });
    return schema.validate(data)
}

const refreshTokenValidation = (data) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required().label("Refresh Token"),
    });
    return schema.validate(data);
};

const createMovieValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().max(100),
        genre: Joi.string().required().max(200),
        summary: Joi.string().required().max(500),
        cast: Joi.string().required().max(200),
        directors: Joi.string().required().max(200),
        year: Joi.number().required(),
        runtime: Joi.string().required(),
    })
    return schema.validate(data)
}

const postReviewValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required(), 
        comment: Joi.string().required()
    });
    return schema.validate(data)
}


module.exports.registrationValidation = registrationValidation 
module.exports.loginValidation = loginValidation 
module.exports.refreshTokenValidation = refreshTokenValidation
module.exports.createMovieValidation = createMovieValidation
module.exports.postReviewValidation = postReviewValidation