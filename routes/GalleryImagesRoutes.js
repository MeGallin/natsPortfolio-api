const express = require('express');
const upload = require('../utils/multer');
const uploadImageController = require('../controllers/GalleryImagesController');
const multer = require('multer');

// Route setup
const router = express.Router();
router.post(
  '/upload',
  upload.single('image'),
  (req, res, next) => {
    if (!req.file) {
      return res
        .status(400)
        .json({
          message: 'Please provide an image file with the field name "image"',
        });
    }
    next();
  },
  uploadImageController,
);

module.exports = router;
