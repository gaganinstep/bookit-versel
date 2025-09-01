const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Create a Multer instance with a dynamic destination.
 * @param {string} destinationPath - The directory where files will be uploaded.
 * @returns {Multer} Multer middleware instance.
 */

const createMulterMiddleware = (destinationPath) => {
  // Define storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../', destinationPath);
      // Create the directory if it doesn't exist

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      console.log(uploadDir, 'uploadDiruploadDir', fs.existsSync(uploadDir));
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Save file with a unique name
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  // File type validation
  const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|JPG|png|gif/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    console.log(extName, 'extName');

    const mimeType = fileTypes.test(file.mimetype);
    console.log(mimeType, 'file.mimetype', file.mimetype);
    if ((mimeType && extName) || file.mimetype === 'application/octet-stream') {
      return cb(null, true);
    } else {
      cb(new Error('Only images (.jpeg, .jpg, .png, .gif) are allowed!'));
    }
  };

  // Return Multer instance
  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  });
};

module.exports = createMulterMiddleware;
