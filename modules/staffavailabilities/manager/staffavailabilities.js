const service = require('../services/staffavailabilities');
const { sendResponse } = require('../utils/helper');

exports.create = async (req, res) => {
  const data = await service.create(req.params.staffId, req.body);
  return sendResponse(res, 201, true, req.__('staff_availability.created'), { data });
};

exports.list = async (req, res) => {
  const data = await service.list(req.params.staffId);
  return sendResponse(res, 200, true, req.__('staff_availability.listed'), { data });
};

exports.update = async (req, res) => {
  await service.update(req.params.id, req.body);
  return sendResponse(res, 200, true, req.__('staff_availability.updated'));
};

exports.delete = async (req, res) => {
  await service.delete(req.params.id);
  return sendResponse(res, 200, true, req.__('staff_availability.deleted'));
};
