const service = require('../services/translations');
const { sendResponse } = require('../utils/helper');

exports.upsert = async (req, res) => {
  const result = await service.upsert(req.body);
  return sendResponse(res, 200, true, req.__('translation.saved'), { result });
};

exports.list = async (req, res) => {
  const results = await service.list(req.query);
  return sendResponse(res, 200, true, req.__('translation.listed'), { results });
};

exports.delete = async (req, res) => {
  await service.delete(req.params.id);
  return sendResponse(res, 200, true, req.__('translation.deleted'));
};
