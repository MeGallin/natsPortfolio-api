const GalleryImage = require('../models/GalleryImagesModel');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');
const { validationResult } = require('express-validator');
const path = require('path');

/**
 * @description Uploads an image to Cloudinary and stores its metadata in the database
 * @route POST /api/gallery-images/upload
 * @access Public
 */
exports.uploadImageController = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ message: 'File size exceeds 2MB limit' });
    }

    const { title, description, by, col, row } = req.body;

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads',
    });

    // Remove the file from local storage after upload
    await fs.promises.unlink(req.file.path);

    // Save image info to the database
    const newImage = new GalleryImage({
      title,
      description,
      by,
      col,
      row,
      url: result.secure_url,
    });

    const savedImage = await newImage.save();

    res.status(200).json({
      message: 'File uploaded and saved successfully',
      image: {
        title: savedImage.title,
        description: savedImage.description,
        by: savedImage.by,
        col: 2,
        row: 2,
        url: savedImage.url,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * @description Fetches all images from the database with optional pagination, sorting, and filtering
 * @route GET /api/gallery-images
 * @access Public
 */
exports.galleryImageController = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      by,
    } = req.query;

    const filter = by ? { by } : {};
    const skip = (page - 1) * limit;

    const images = await GalleryImage.find(filter)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await GalleryImage.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / limit),
      images,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Middleware for validating input
 */
const { body } = require('express-validator');
exports.validateImageUpload = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('by').notEmpty().withMessage('Author is required'),
];
