import Joi from 'joi';

export const newGroupSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .required(),

    permission: Joi.array()
        .items(
            Joi.string().valid('READ'),
            Joi.string().valid('WRITE'),
            Joi.string().valid('DELETE'),
            Joi.string().valid('SHARE'),
            Joi.string().valid('UPLOAD_FILES')
        )
        .required()
});

export const updateGroupSchema = Joi.object({
    name: Joi.string()
        .alphanum(),

    permission: Joi.array()
        .items(
            Joi.string().valid('READ'),
            Joi.string().valid('WRITE'),
            Joi.string().valid('DELETE'),
            Joi.string().valid('SHARE'),
            Joi.string().valid('UPLOAD_FILES')
        )
});
