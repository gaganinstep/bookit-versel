const service = require('../services/businessHours');
const { sendResponse } = require('../utils/helper');

exports.setHour = async (req, res) => {
  const record = await service.setBusinessHour(req.params.locationId, req.body);
  return sendResponse(res, 200, true, req.__('hours.updated'), { record });
};

exports.getHours = async (req, res) => {
  const hours = await service.getBusinessHours(req.params.locationId);
  return sendResponse(res, 200, true, req.__('hours.found'), { hours });
};

exports.deleteHour = async (req, res) => {
  await service.deleteBusinessHour(req.params.locationId, req.params.day);
  return sendResponse(res, 200, true, req.__('hours.deleted'));
};
