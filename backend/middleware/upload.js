const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Create upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types
    cb(null, true);
  }
});

// Custom middleware to upload to Cloudinary after multer
const uploadToCloudinary = async (req, res, next) => {
  if (req.file) {
    try {
      // Convert buffer to stream
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'lisaa-tourist-website',
          resource_type: 'auto',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return next(error);
          }
          req.file.cloudinary = result;
          next();
        }
      );

      // Create readable stream from buffer
      const readableStream = new Readable();
      readableStream.push(req.file.buffer);
      readableStream.push(null);
      readableStream.pipe(stream);
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      next(error);
    }
  } else if (req.files && req.files.length > 0) {
    // Handle multiple files
    try {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'lisaa-tourist-website',
              resource_type: 'auto',
              transformation: [
                { width: 1920, height: 1080, crop: 'limit', quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                file.cloudinary = result;
                resolve(result);
              }
            }
          );

          const readableStream = new Readable();
          readableStream.push(file.buffer);
          readableStream.push(null);
          readableStream.pipe(stream);
        });
      });

      await Promise.all(uploadPromises);
      next();
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      next(error);
    }
  } else {
    next();
  }
};

// Export both multer upload and Cloudinary middleware
module.exports = {
  upload,
  uploadToCloudinary
};

