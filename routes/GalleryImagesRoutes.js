const express = require('express');
const upload = require('../utils/multer');
const {
  uploadImageController,
  galleryImageController,
} = require('../controllers/GalleryImagesController');

// Route setup
const router = express.Router();
router.post(
  '/upload',
  upload.single('image'),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please provide an image file with the field name "image"',
      });
    }
    next();
  },
  uploadImageController,
);

router.get('/gallery-images', galleryImageController);

module.exports = router;
