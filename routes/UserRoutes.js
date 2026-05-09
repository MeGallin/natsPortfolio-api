const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const {
  register,
  login,
  getUserDetails,
  updateDetails,
  forgotPassword,
  resetPassword,
} = require('../controllers/UserController');
const { protect } = require('../middleware/AuthMiddleware');
const validateRequest = require('../middleware/ValidateRequest');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidation = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
];

const resetPasswordValidation = [
  param('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const updateDetailsValidation = [
  param('id').isMongoId().withMessage('A valid user id is required'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be blank'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail(),
];

router.route('/register').post(registerValidation, validateRequest, register);
router.route('/login').post(loginValidation, validateRequest, login);
router
  .route('/forgot-password')
  .post(forgotPasswordValidation, validateRequest, forgotPassword);
router
  .route('/reset-password/:token')
  .put(resetPasswordValidation, validateRequest, resetPassword);
router.route('/user-details').get(protect, getUserDetails);
router
  .route('/user-update/:id')
  .patch(protect, updateDetailsValidation, validateRequest, updateDetails);

module.exports = router;
