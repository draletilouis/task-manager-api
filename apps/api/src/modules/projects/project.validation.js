import { body, param } from 'express-validator';

/**
 * Validation rules for creating a project
 */
export const createProjectValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    body('name')
        .trim()
        .notEmpty().withMessage('Project name is required')
        .isString().withMessage('Project name must be a string')
        .isLength({ min: 1, max: 100 }).withMessage('Project name must be between 1 and 100 characters'),

    body('description')
        .optional()
        .trim()
        .isString().withMessage('Description must be a string')
        .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters')
];

/**
 * Validation rules for getting projects
 */
export const getProjectsValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string')
];

/**
 * Validation rules for updating a project
 */
export const updateProjectValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    param('projectId')
        .notEmpty().withMessage('Project ID is required')
        .isString().withMessage('Project ID must be a string'),

    body('name')
        .trim()
        .notEmpty().withMessage('Project name is required')
        .isString().withMessage('Project name must be a string')
        .isLength({ min: 1, max: 100 }).withMessage('Project name must be between 1 and 100 characters'),

    body('description')
        .optional()
        .trim()
        .isString().withMessage('Description must be a string')
        .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters')
];

/**
 * Validation rules for deleting a project
 */
export const deleteProjectValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    param('projectId')
        .notEmpty().withMessage('Project ID is required')
        .isString().withMessage('Project ID must be a string')
];
