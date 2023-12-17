const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_API_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: './uploads',
  allowedFormats: ['jpg', 'png', 'jpeg'],
});

module.exports = {
  cloudinary,
  storage,
};
