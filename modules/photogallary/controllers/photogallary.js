const { buildSchema } = require('../../../middlewares/joiValidation');
const validation = require('../validations/photogallary');
const manager = require('../manager/photogallary');
const CustomError = require('../../../middlewares/customError');
const path = require('path');
const fs = require('fs');

exports.uploadPhoto = async (req, res, next) => {
try {
    const schema = buildSchema(validation.uploadPhoto);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const photo_urls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const uploadPath = path.join(__dirname, '../../../uploads/photogallery', fileName);
        fs.writeFileSync(uploadPath, file.buffer);
        photo_urls.push(`/uploads/photogallery/${fileName}`);
      }
    }

    req.body.photo_urls = photo_urls;

    return await manager.uploadMultiplePhotos(req, res);
  } catch (err) {
    return next(err);
  }
};


exports.getImagesByBusinessId = async (req, res, next) => {
  try {
    return await manager.getImagesByBusinessId(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.deleteImageById = async (req, res, next) => {
  try {
    return await manager.deleteImageById(req, res);
  } catch (err) {
    return next(err);
  }
};
