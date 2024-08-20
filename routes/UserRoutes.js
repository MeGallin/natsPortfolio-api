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
const { protect } = require('../middleWare/authMiddleWare');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').put(resetPassword);
router.route('/user-details').get(protect, getUserDetails);

module.exports = router;
