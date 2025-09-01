const service = require('../services/serviceTranslations');
const { sendResponse } = require('../utils/helper');

exports.upsert = async (req, res) => {
  const record = await service.upsert(req.params.serviceId, req.body);
  return sendResponse(res, 200, true, req.__('service.translation.saved'), { record });
};

exports.list = async (req, res) => {
  const records = await service.list(req.params.serviceId);
  return sendResponse(res, 200, true, req.__('service.translation.listed'), { records });
};

exports.delete = async (req, res) => {
  await service.delete(req.params.serviceId, req.params.language_code);
  return sendResponse(res, 200, true, req.__('service.translation.deleted'));
};
