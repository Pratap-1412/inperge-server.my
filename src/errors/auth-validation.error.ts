
import { body } from 'express-validator';

// signupValidationMiddleware.ts
export const ValidateSignupFields = [
  body('first_name').not().isEmpty().withMessage('First name is required.'),
  body('last_name').not().isEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Email is invalid.'),
  body('mobile_no').isInt().isLength({ min: 10, max: 10 }).withMessage('Mobile number must be an integer.'),
];
