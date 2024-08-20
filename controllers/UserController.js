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
  try {
    if (!name || !email || !password)
      return next(new ErrorResponse('Registration failed', 500));

    const user = await User.create({
      name,
      email,
      password,
      profileImage: '/assets/images/sample.jpg',
      cloudinaryId: '12345',
      ipAddress: ipAddress,
      loginCounter: 0,
      downloadCounter: 0,
      registeredWithGoogle: false,
    });

    const link = `${
      process.env.MAILER_LOCAL_URL
    }api/confirm-email/${generateToken(user._id)}`;
    const message = `<h1>Hi ${name}</h1><p>You have successfully registered with Gary's website.</p><p>Please click the link below to verify your email address.</p><h4>Please note, in order to get full functionality you must confirm your mail address with the link below.</h4></p><p><a href=${link} id='link'>Click here to verify</a></p><p>Thank you Gary.</p>`;

    // Send Email
    sendEmail({
      from: process.env.MAILER_FROM,
      to: email, // change to this when live user.email
      subject: 'Gary Allin Registration',
      html: message,
    });
    res
      .status(200)
      .json({ success: true, data: `Email sent successfully ${link}` });

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

//Google Login

// @description: User has forgotten password Send email with reset link
// @route: POST /api/forgot-password
// @access: PUBLIC
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorResponse('Email could not be found.', 404));

    try {
      const resetToken = user.getResetPasswordToken();
      await user.save();
      const resetUrl = `${process.env.RESET_PASSWORD_LOCAL_URL}#/password-reset/${resetToken}`;
      const message = `<h1>You have requested a password reset.</h1><p>Please click on the following link to reset your password.</p><p><a href=${resetUrl} id='link'>Click here to verify</a></p>`;
      // Send Email

      sendEmail({
        from: process.env.MAILER_FROM,
        to: user.email,
        subject: 'Password Reset Request',
        html: message,
      });

      res.status(200).json({ success: true, data: `Email sent successfully` });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
  } catch (error) {
    next(error);
  }
};

// @description: USER ADMIN Password reset
// @route: PUT /api/resetpassword/:token
// @access: PUBLIC
// @description: USER ADMIN Password reset
// @route: PUT /api/resetpassword/:token
// @access: PUBLIC
exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return next(new ErrorResponse('Invalid Reset Token', 400));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, data: 'Password was successfully changed.' });
  } catch (error) {
    next(error);
  }
};

// @description: USER ADMIN DETAIL UPDATE
// @route: PUT /api/user/:id
// @access: Private
