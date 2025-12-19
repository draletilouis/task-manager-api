import { body } from 'express-validator';

/**
 * Validation rules for user registration
 */
export const registerValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 }).withMessage('Email must not exceed 255 characters'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters'),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters')
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for token refresh
 */
export const refreshTokenValidation = [
    body('refreshToken')
        .notEmpty().withMessage('Refresh token is required')
        .isString().withMessage('Refresh token must be a string')
];

/**
 * Validation rules for password change
 */
export const changePasswordValidation = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
        .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('New password must contain at least one number')
        .isLength({ max: 128 }).withMessage('New password must not exceed 128 characters')
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        })
];

/**
 * Validation rules for forgot password request
 */
export const forgotPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail()
];

/**
 * Validation rules for reset password
 */
export const resetPasswordValidation = [
    body('token')
        .notEmpty().withMessage('Reset token is required')
        .isString().withMessage('Reset token must be a string'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters')
];
