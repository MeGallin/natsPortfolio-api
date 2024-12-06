const mongoose = require('mongoose');

// GalleryImages Schema
const GalleryImagesSchema = mongoose.Schema(
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
  },
  {
    timestamps: true,
  },
);

const GalleryImage = mongoose.model('GalleryImages', GalleryImagesSchema);

module.exports = GalleryImage;
