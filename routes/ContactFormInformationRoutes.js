const express = require('express');
const router = express.Router();

const {
  sendContactForm,
} = require('../controllers/ContactFormInformationController');
router.route('/contact-form').post(sendContactForm);

module.exports = router;
