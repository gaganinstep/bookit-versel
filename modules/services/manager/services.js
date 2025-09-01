const service = require('../services/services');
const { sendResponse } = require('../utils/helper');

exports.create = async (req, res) => {
  const data = await service.createService(req.body);
  return sendResponse(res, 201, true, req.__('service.created'),data);
};

exports.getServiceById = async (req, res) => {
  const data = await service.getServiceById(req.params.id);
  if (!data) return sendResponse(res, 404, false, req.__('service.not_found'));
  return sendResponse(res, 200, true, req.__('service.found'), data);
};

exports.update = async (req, res) => {
  const data = await service.updateService(req.params.id, req.body);
  return sendResponse(res, 200, true, req.__('service.updated'),data);
};

exports.delete = async (req, res) => {
  const data = await service.deleteService(req.params.id);
  return sendResponse(res, 200, true, req.__('service.deleted'),data);
};

exports.list = async (req, res) => {
  const result = await service.listServices(req.query);
  return sendResponse(res, 200, true, req.__('service.listed'), {
    total: result.count,
    rows: result.rows
  });
};
