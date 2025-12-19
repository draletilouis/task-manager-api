import { body, param, query } from 'express-validator';

/**
 * Validation rules for creating a task
 */
export const createTaskValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    param('projectId')
        .notEmpty().withMessage('Project ID is required')
        .isString().withMessage('Project ID must be a string'),

    body('title')
        .trim()
        .notEmpty().withMessage('Task title is required')
        .isString().withMessage('Task title must be a string')
        .isLength({ min: 1, max: 200 }).withMessage('Task title must be between 1 and 200 characters'),

    body('description')
        .optional()
        .trim()
        .isString().withMessage('Description must be a string')
        .isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters'),

    body('status')
        .optional()
        .isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Status must be one of: TODO, IN_PROGRESS, DONE'),

    body('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be one of: LOW, MEDIUM, HIGH'),

    body('assignedTo')
        .optional()
        .isString().withMessage('Assigned user ID must be a string'),

    body('dueDate')
        .optional()
        .isISO8601().withMessage('Due date must be a valid date')
        .toDate()
];

/**
 * Validation rules for getting tasks
 */
export const getTasksValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    param('projectId')
        .notEmpty().withMessage('Project ID is required')
        .isString().withMessage('Project ID must be a string'),

    query('status')
        .optional()
        .isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Status must be one of: TODO, IN_PROGRESS, DONE'),

    query('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be one of: LOW, MEDIUM, HIGH'),

    query('assignedTo')
        .optional()
        .isString().withMessage('Assigned user ID must be a string')
];

/**
 * Validation rules for getting a single task
 */
export const getTaskValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    param('projectId')
        .notEmpty().withMessage('Project ID is required')
        .isString().withMessage('Project ID must be a string'),

    param('taskId')
        .notEmpty().withMessage('Task ID is required')
        .isString().withMessage('Task ID must be a string')
];

/**
 * Validation rules for updating a task
 */
export const updateTaskValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    param('projectId')
        .notEmpty().withMessage('Project ID is required')
        .isString().withMessage('Project ID must be a string'),

    param('taskId')
        .notEmpty().withMessage('Task ID is required')
        .isString().withMessage('Task ID must be a string'),

    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Task title cannot be empty')
        .isString().withMessage('Task title must be a string')
        .isLength({ min: 1, max: 200 }).withMessage('Task title must be between 1 and 200 characters'),

    body('description')
        .optional()
        .trim()
        .isString().withMessage('Description must be a string')
        .isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters'),

    body('status')
        .optional()
        .isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Status must be one of: TODO, IN_PROGRESS, DONE'),

    body('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be one of: LOW, MEDIUM, HIGH'),

    body('assignedTo')
        .optional()
        .custom((value) => {
            if (value === null || typeof value === 'string') {
                return true;
            }
            throw new Error('Assigned user ID must be a string or null');
        }),

    body('dueDate')
        .optional()
        .custom((value) => {
            if (value === null) {
                return true;
            }
            // Check if it's a valid ISO8601 date
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error('Due date must be a valid date or null');
            }
            return true;
        })
];

/**
 * Validation rules for deleting a task
 */
export const deleteTaskValidation = [
    param('workspaceId')
        .notEmpty().withMessage('Workspace ID is required')
        .isString().withMessage('Workspace ID must be a string'),

    param('projectId')
        .notEmpty().withMessage('Project ID is required')
        .isString().withMessage('Project ID must be a string'),

    param('taskId')
        .notEmpty().withMessage('Task ID is required')
        .isString().withMessage('Task ID must be a string')
];
