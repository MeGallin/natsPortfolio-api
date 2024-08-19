const express = require('express');
const router = express.Router();
const {
  confirmEmailLink,
} = require('../controllers/EmailConfirmationLinkController');

router.route('/confirm-email/:token').get(confirmEmailLink);

module.exports = router;
