import Joi from 'joi';

export const newUserSchema = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp(/^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/))
        .required(),

    age: Joi.number()
        .integer()
        .min(4)
        .max(130)
        .required()
});

export const updateUserSchema = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(30),

    password: Joi.string()
        .pattern(new RegExp(/^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/)),

    age: Joi.number()
        .integer()
        .min(4)
        .max(130)
});
