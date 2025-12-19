import { body, param } from 'express-validator';

/**
 * Validation rules for creating a comment
 */
export const createCommentValidation = [
    param('taskId')
        .notEmpty().withMessage('Task ID is required')
        .isString().withMessage('Task ID must be a string'),

    body('content')
        .trim()
        .notEmpty().withMessage('Comment content is required')
        .isString().withMessage('Comment content must be a string')
        .isLength({ min: 1, max: 1000 }).withMessage('Comment content must be between 1 and 1000 characters')
];

/**
 * Validation rules for getting comments
 */
export const getCommentsValidation = [
    param('taskId')
        .notEmpty().withMessage('Task ID is required')
        .isString().withMessage('Task ID must be a string')
];

/**
 * Validation rules for updating a comment
 */
export const updateCommentValidation = [
    param('commentId')
        .notEmpty().withMessage('Comment ID is required')
        .isString().withMessage('Comment ID must be a string'),

    body('content')
        .trim()
        .notEmpty().withMessage('Comment content is required')
        .isString().withMessage('Comment content must be a string')
        .isLength({ min: 1, max: 1000 }).withMessage('Comment content must be between 1 and 1000 characters')
];

/**
 * Validation rules for deleting a comment
 */
export const deleteCommentValidation = [
    param('commentId')
        .notEmpty().withMessage('Comment ID is required')
        .isString().withMessage('Comment ID must be a string')
];
