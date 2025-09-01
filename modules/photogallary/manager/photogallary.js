const photoService = require('../services/photogallary');
const { sendResponse } = require('../../../utils/helper');

exports.uploadMultiplePhotos = async (req, res) => {
  const photo = await photoService.uploadMultiplePhotos(req.body);
  return sendResponse(res, 201, true, req.__('image.uploaded'), { photo });
};


exports.getImagesByBusinessId = async (req, res) => {
  const images = await photoService.getImagesByBusinessId(req.params.business_id);
  return sendResponse(res, 200, true, req.__('images.listed'), { images });
};

exports.deleteImageById = async (req, res) => {
  const result = await photoService.deleteImageById(req.params.id);
  return sendResponse(res, 200, true, req.__('image.deleted'), result);
};
