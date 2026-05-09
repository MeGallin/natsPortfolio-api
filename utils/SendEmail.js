const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const port = Number(process.env.MAILER_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PW,
    },
  });

  const mailOptions = {
    from: options.from || process.env.MAILER_FROM,
    to: options.to,
    bcc: process.env.MAILER_BCC,
    subject: options.subject,
    html: options.html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
