const { body } = require('express-validator');

module.exports = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('dueDate')
        .optional()
        .isISO8601().withMessage('Invalid date format (YYYY-MM-DD)'),
    body('projectId')
        .notEmpty().withMessage('projectId is required')
        .isInt().withMessage('projectId must be an integer')
];
