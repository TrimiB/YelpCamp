const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_API_KEY,
});

/**
 * Configures Cloudinary storage for uploading images to Cloudinary.
 * Creates a new CloudinaryStorage instance, passing the cloudinary
 * client and configuration parameters for saving images to the
 * 'uploads' folder and allowing 'jpg', 'png', 'jpeg' formats.
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});

module.exports = {
  cloudinary,
  storage,
};
