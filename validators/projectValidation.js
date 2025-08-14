const { body } = require('express-validator');

module.exports = [
    body('title')
        .notEmpty().withMessage('Project name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('description')
        .optional().isString().withMessage('Description must be a string'),
    body('location')
        .notEmpty().withMessage('Project location is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

];
