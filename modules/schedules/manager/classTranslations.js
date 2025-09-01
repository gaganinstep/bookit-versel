const service = require('../services/classTranslations');
const { sendResponse } = require('../utils/helper');

exports.upsert = async (req, res) => {
  const result = await service.upsert(req.params.classId, req.body);
  return sendResponse(res, 200, true, req.__('class.translation.saved'), { result });
};

exports.list = async (req, res) => {
  const results = await service.list(req.params.classId);
  return sendResponse(res, 200, true, req.__('class.translation.listed'), { results });
};

exports.delete = async (req, res) => {
  await service.delete(req.params.classId, req.params.language_code);
  return sendResponse(res, 200, true, req.__('class.translation.deleted'));
};
