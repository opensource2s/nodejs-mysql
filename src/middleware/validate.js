const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateCreateUser = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('age').optional().isInt({ min: 1 }).withMessage('Age must be a positive integer'),
  handleValidation,
];

const validateUpdateUser = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('age').optional().isInt({ min: 1 }).withMessage('Age must be a positive integer'),
  handleValidation,
];

module.exports = { validateCreateUser, validateUpdateUser };
