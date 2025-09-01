const service = require('../services/notifications');
const { sendResponse } = require('../utils/helper');

exports.create = async (req, res) => {
  const data = await service.create(req.body);
  return sendResponse(res, 201, true, req.__('notification.created'), { data });
};

exports.list = async (req, res) => {
  const data = await service.list();
  return sendResponse(res, 200, true, req.__('notification.listed'), { data });
};

exports.get = async (req, res) => {
  const data = await service.get(req.params.id);
  if (!data) return sendResponse(res, 404, false, req.__('notification.not_found'));
  return sendResponse(res, 200, true, req.__('notification.found'), { data });
};

exports.delete = async (req, res) => {
  await service.delete(req.params.id);
  return sendResponse(res, 200, true, req.__('notification.deleted'));
};
