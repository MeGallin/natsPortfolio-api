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
    col: {
      type: Number,
      default: 2,
    },
    row: {
      type: Number,
      default: 2,
    },
  },
  {
    timestamps: true,
  },
);

const GalleryImage = mongoose.model('GalleryImage', GalleryImagesSchema);

module.exports = GalleryImage;
