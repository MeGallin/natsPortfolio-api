const express = require('express');
const router = express.Router();
const {
  sendContactForm,
  getContacts,
} = require('../controllers/ContactFormInformationController');
const { protect, admin } = require('../middleware/AuthMiddleware');

router.route('/contact-form').post(sendContactForm);
router.route('/contacts').get(protect, admin, getContacts);

module.exports = router;
