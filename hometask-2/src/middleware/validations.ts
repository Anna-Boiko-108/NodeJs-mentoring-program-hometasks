import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export enum ERRORS {
    VALIDATION_FAILED = 'Validation failed!'
}

const errorResponse = (schemaErrors: Joi.ValidationErrorItem[]) => {
    const errors = schemaErrors.map((error) => {
        const { path, message } = error;
        return { path, message };
    });
    return {
        status: ERRORS.VALIDATION_FAILED,
        errors
    };
};


export const validateSchema = (schema: Joi.ObjectSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error?.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            next();
        }
    };
};
