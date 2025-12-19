import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 * Use this after validation rules to check for errors
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path || error.param,
            message: error.msg,
            value: error.value
        }));

        return res.status(400).json({
            error: 'Validation failed',
            details: errorMessages
        });
    }

    next();
};
