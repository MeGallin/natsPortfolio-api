const express = require('express');
const upload = require('../utils/multer');
const {
  uploadImageController,
  galleryImageController,
  deleteImageController,
} = require('../controllers/GalleryImagesController');
const { protect } = require('../middleWare/authMiddleWare');

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
router
  .route('/gallery-image-delete/:id')
  .delete(protect, deleteImageController);

module.exports = router;
