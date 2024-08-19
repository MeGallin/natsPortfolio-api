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
