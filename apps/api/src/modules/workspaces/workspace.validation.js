import { body, param } from 'express-validator';

/**
 * Validation rules for creating a workspace
 */
export const createWorkspaceValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Workspace name is required')
        .isLength({ min: 1, max: 100 }).withMessage('Workspace name must be between 1 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_]+$/).withMessage('Workspace name can only contain letters, numbers, spaces, hyphens, and underscores')
];

/**
 * Validation rules for updating a workspace
 */
export const updateWorkspaceValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    body('name')
        .trim()
        .notEmpty().withMessage('Workspace name is required')
        .isLength({ min: 1, max: 100 }).withMessage('Workspace name must be between 1 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_]+$/).withMessage('Workspace name can only contain letters, numbers, spaces, hyphens, and underscores')
];

/**
 * Validation rules for workspace ID parameter
 */
export const workspaceIdValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string')
];

/**
 * Validation rules for inviting a member
 */
export const inviteMemberValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('role')
        .optional()
        .isIn(['OWNER', 'ADMIN', 'MEMBER']).withMessage('Role must be one of: OWNER, ADMIN, MEMBER')
];

/**
 * Validation rules for removing a member
 */
export const removeMemberValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    param('userId')
        .notEmpty().withMessage('User ID is required')
        .isString().withMessage('User ID must be a string')
];

/**
 * Validation rules for updating member role
 */
export const updateMemberRoleValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    param('userId')
        .notEmpty().withMessage('User ID is required')
        .isString().withMessage('User ID must be a string'),

    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['OWNER', 'ADMIN', 'MEMBER']).withMessage('Role must be one of: OWNER, ADMIN, MEMBER')
];
