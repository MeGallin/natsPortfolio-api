const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  getUserDetails,
  userUpdateAdminDetails,
  forgotPassword,
  resetPassword,
  userDownloadCounter,
} = require('../controllers/UserController');

router.route('/register').post(register);

module.exports = router;
