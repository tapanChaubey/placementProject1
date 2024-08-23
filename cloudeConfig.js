const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true  // Ensure HTTPS is used for secure connection
});

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        alloweredFormats: ["png", "jpg", "jpeg"],  // Fix typo from 'alloweredFormats' to 'allowed_formats'
    },
});

module.exports = {
    cloudinary,
    storage
};
