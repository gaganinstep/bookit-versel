const service = require('../services/schedules');
const { sendResponse } = require('../utils/helper');

exports.create = async (req, res) => {
  const result = await service.create(req.params.classId, req.body);
  const isUpdate = req.body.id ? true : false;
  const message = isUpdate ? req.__('class.schedule.updated') : req.__('class.schedule.created');
  return sendResponse(res, isUpdate ? 200 : 201, true, message, { result });
};

exports.list = async (req, res) => {
  const result = await service.list(req.params.classId);
  return sendResponse(res, 200, true, req.__('class.schedule.listed'), result);
};

exports.listByBusiness = async (req, res) => {
  const result = await service.listByBusiness(req.params.classId);
  return sendResponse(res, 200, true, req.__('class.schedule.listed'), { schedules: result });
};

exports.update = async (req, res) => {
  await service.update(req.params.id, req.body);
  return sendResponse(res, 200, true, req.__('class.schedule.updated'));
};

exports.delete = async (req, res) => {
  await service.delete(req.params.id);
  return sendResponse(res, 200, true, req.__('class.schedule.deleted'));
};
