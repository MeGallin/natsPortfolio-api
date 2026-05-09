const GalleryImage = require('../models/GalleryImagesModel');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @description Uploads an image to Cloudinary and stores its metadata in the database
 * @route POST /api/gallery-images/upload
 * @access Public
 */
exports.uploadImageController = async (req, res) => {
  let uploadedPublicId;

  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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
    uploadedPublicId = result.public_id;

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
      cloudinaryId: result.public_id,
    });

    const savedImage = await newImage.save();

    res.status(200).json({
      message: 'File uploaded and saved successfully',
      image: {
        title: savedImage.title,
        description: savedImage.description,
        by: savedImage.by,
        id: savedImage.id,
        col: savedImage.col,
        row: savedImage.row,
        url: savedImage.url,
        cloudinaryId: savedImage.cloudinaryId,
      },
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }

    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId).catch(() => {});
    }

    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Internal server error' });
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

/**
 * @description Delete image and notes
 * @route GET /api/gallery-image-delete/:id
 * @access Admin
 */
exports.deleteImageController = async (req, res, next) => {
  try {
    // Find the image by ID
    const image = await GalleryImage.findById(req.params.id);

    // Check if the image exists
    if (!image) {
      return next(new ErrorResponse('No image found with this ID!', 404));
    }

    // Extract the public ID from the stored Cloudinary metadata or URL fallback
    const fallbackPublicId = image.url
      ? `uploads/${image.url.split('/').pop().split('.')[0]}`
      : null;
    const publicId = image.cloudinaryId || fallbackPublicId;
    if (!publicId) {
      return next(
        new ErrorResponse(
          'Could not extract public ID from Cloudinary URL',
          400,
        ),
      );
    }

    // Delete the image from Cloudinary
    const cloudinaryResult = await cloudinary.uploader.destroy(publicId);

    if (cloudinaryResult.result === 'not found') {
      return next(new ErrorResponse('Image was not found in Cloudinary', 404));
    }

    // Remove the image from the database
    await GalleryImage.deleteOne({ _id: req.params.id });

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Image successfully deleted!',
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return next(
      new ErrorResponse('An error occurred while deleting the image', 500),
    );
  }
};
