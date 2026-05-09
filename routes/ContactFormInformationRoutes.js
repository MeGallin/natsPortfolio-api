const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  sendContactForm,
  getContacts,
} = require('../controllers/ContactFormInformationController');
const { protect, admin } = require('../middleware/AuthMiddleware');
const validateRequest = require('../middleware/ValidateRequest');

const contactFormValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

router
  .route('/contact-form')
  .post(contactFormValidation, validateRequest, sendContactForm);
router.route('/contacts').get(protect, admin, getContacts);

module.exports = router;
