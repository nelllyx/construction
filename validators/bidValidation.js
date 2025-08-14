const { body } = require('express-validator');

module.exports = [
    body('price')
        .notEmpty().withMessage('Price is required')
        .isInt({ gt: 0 }).withMessage('Price must be a positive integer'),
    body('duration')
        .notEmpty().withMessage('Duration is required')
        .isString().withMessage('Duration must be a string'),
    body('projectId')
        .notEmpty().withMessage('projectId is required')
        .isInt().withMessage('projectId must be an integer'),
];
