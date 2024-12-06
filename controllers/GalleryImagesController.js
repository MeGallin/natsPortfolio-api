const GalleryImage = require('../models/GalleryImagesModel'); // Correct import for GalleryImage model
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');

// Controller for uploading image to Cloudinary
const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check for missing fields
    const { title, description, by } = req.body;
    if (!title || !description || !by) {
      return res
        .status(400)
        .json({ message: 'Title, description, and author are required' });
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads',
    });

    // Remove the file from local storage after upload
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error('Error removing file:', err);
      }
    });

    // Save image info to the database
    const newImage = new GalleryImage({
      title,
      description,
      by,
      url: result.secure_url,
    });
    const savedImage = await newImage.save();

    res.status(200).json({
      message: 'File uploaded and saved successfully',
      image: savedImage,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

module.exports = uploadImageController;
