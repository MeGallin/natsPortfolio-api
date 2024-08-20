const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const ContactFormInformation = require('../models/ContactFormInformationModel');

exports.sendContactForm = async (req, res, next) => {
  const { name, email, message } = req.body;

  try {
    if (!name && !email && !message)
      return next(new ErrorResponse('Form can NOT be black', 500));

    await ContactFormInformation.create({ name, email, message });

    const text = `<h1>Hi ${name}</h1><p>Thank you for your enquiry</p><p>This is what you sent:</p><h2>${message}</h2><h4>I will be in contact with in due course.</h4><p>Thank you.</p><h3>Gary</h3>`;

    // Send Email
    sendEmail({
      from: process.env.MAILER_FROM,
      to: email,
      subject: 'Gary Allin Contact Form',
      html: text,
    });
    res.status(200).json({ success: true, data: `Email sent successfully` });
  } catch (error) {
    next(error);
  }
};

// @description: Get information of contact form submissions
// @route: GET /api/contacts
// @access: PRIVATE & ADMIN
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await ContactFormInformation.find();
    if (!contacts || contacts.length === 0) {
      return next(new ErrorResponse('Nothing could be found', 404));
    }
    res.status(200).json({
      status: 'success',
      contacts,
    });
  } catch (error) {
    return next(
      new ErrorResponse('An error occurred while fetching contacts', 500),
    );
  }
};
