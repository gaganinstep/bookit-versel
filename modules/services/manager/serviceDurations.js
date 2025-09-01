const service = require('../services/serviceDurations');
const { sendResponse } = require('../utils/helper');

exports.create = async (req, res) => {
  const record = await service.create(req.params.serviceId, req.body);
  return sendResponse(res, 201, true, req.__('duration.created'), { record });
};

exports.list = async (req, res) => {
  const records = await service.list(req.params.serviceId);
  return sendResponse(res, 200, true, req.__('duration.listed'), { records });
};

exports.update = async (req, res) => {
  await service.update(req.params.id, req.body);
  return sendResponse(res, 200, true, req.__('duration.updated'));
};

exports.delete = async (req, res) => {
  await service.delete(req.params.id);
  return sendResponse(res, 200, true, req.__('duration.deleted'));
};
