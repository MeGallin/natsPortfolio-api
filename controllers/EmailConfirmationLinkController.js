const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/ErrorResponse');

// @description: Confirmation Email
// @route: GET /confirm-email/:token
// @access: public
exports.confirmEmailLink = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return next(new ErrorResponse('No user found', 404));
    }

    user.isConfirmed = true;
    await user.save();

    if (process.env.NODE_ENV === 'production') {
      return res.redirect('https://garyallin.uk/');
    }

    return res.status(200).send({ message: 'Your Account has been Verified.' });
  } catch (error) {
    return next(new ErrorResponse('Invalid or expired confirmation token', 400));
  }
};
