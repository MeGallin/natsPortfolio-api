const crypto = require('crypto');
const User = require('../models/UserModel');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const requestIp = require('request-ip');
const sendEmail = require('../utils/sendEmail');

// @description: Register new user
// @route: POST /api/register
// @access: Public
exports.register = async (req, res, next) => {
  const ipAddress = requestIp.getClientIp(req);
  const { name, email, password } = req.body;

  // Add email confirmation links

  try {
    if (!name || !email || !password)
      return next(new ErrorResponse('Registration failed', 500));

    const user = await User.create({
      name,
      email,
      password,
      isAdmin: false,
      isConfirmed: false,
      profileImage: '/assets/images/sample.jpg',
      cloudinaryId: '12345',
      resetPasswordToken: '12334',
      ipAddress,
      loginCounter: 0,
      registeredWithGoogle: false,
    });

    res
      .status(200)
      .json({ success: true, data: `${name} successfully added. ` });

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  } catch (error) {
    next(error);
  }
};

// Generate a secret token for the user
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET);
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token, name: user.name });
};

// @description: USER login
// @route: POST /api/login
// @access: Public
exports.login = async (req, res, next) => {
  const ipAddress = requestIp.getClientIp(req);
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorResponse('Please provide an email and Password', 400));

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Please provide valid credentials', 401));
    }
    const isMatched = await user.matchPasswords(password);
    if (!isMatched) {
      return next(new ErrorResponse('Please provide valid credentials', 401));
    }
    user.loginCounter = user.loginCounter + 1;
    user.ipAddress = ipAddress;
    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @description: User has forgotten password Send email with reset link
// @route: POST /api/forgot-password
// @access: PUBLIC

// @description: USER ADMIN DETAIL UPDATE
// @route: PUT /api/user/:id
// @access: Private

// @description: Get user data of logged in in user
// @route: GET /api/users/user
// @access: PRIVATE

// @description: USER ADMIN Password reset
// @route: PUT /api/resetpassword/:token
// @access: PUBLIC
