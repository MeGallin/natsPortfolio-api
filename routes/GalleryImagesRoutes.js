const express = require('express');
const upload = require('../utils/multer');
const {
  uploadImageController,
  galleryImageController,
  deleteImageController,
  validateImageUpload,
} = require('../controllers/GalleryImagesController');
const { protect, admin } = require('../middleware/AuthMiddleware');
const validateRequest = require('../middleware/ValidateRequest');

// Route setup
const router = express.Router();
router.post(
  '/upload',
  protect,
  admin,
  upload.single('image'),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please provide an image file with the field name "image"',
      });
    }
    return next();
  },
  validateImageUpload,
  validateRequest,
  uploadImageController,
);

router.get('/gallery-images', galleryImageController);
router
  .route('/gallery-image-delete/:id')
  .delete(protect, admin, deleteImageController);

module.exports = router;
