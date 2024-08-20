const express = require('express');
const router = express.Router();
const {
  sendContactForm,
  getContacts,
} = require('../controllers/ContactFormInformationController');
const { protect, admin } = require('../middleWare/authMiddleWare');

router.route('/contact-form').post(sendContactForm);
router.route('/contacts').get(protect, admin, getContacts);

module.exports = router;
