const mongoose = require('mongoose');

// GalleryImages Schema
const GalleryImagesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Image title is required'],
    },
    description: {
      type: String,
      required: [true, 'Image description is required'],
    },
    by: {
      type: String,
      required: [true, 'Image author is required'],
    },
    url: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
    },
    col: {
      type: Number,
      default: 1,
    },
    row: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const GalleryImage = mongoose.model('GalleryImage', GalleryImagesSchema);

module.exports = GalleryImage;
