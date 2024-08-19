const mongoose = require('mongoose');

const ContactFormInformationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
  },
  {
    timestamps: true,
  },
);

const ContactFormInformation = mongoose.model(
  'ContactFormInformation',
  ContactFormInformationSchema,
);
module.exports = ContactFormInformation;
