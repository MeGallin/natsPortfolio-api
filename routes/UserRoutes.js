const express = require('express');
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

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').put(resetPassword);
router.route('/user-details').get(protect, getUserDetails);
router.route('/user-update/:id').patch(protect, updateDetails);

module.exports = router;
