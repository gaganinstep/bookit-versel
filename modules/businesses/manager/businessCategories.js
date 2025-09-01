const service = require('../services/businessCategories');
const { sendResponse } = require('../utils/helper');

exports.assign = async (req, res) => {
  const data = await service.assignCategories(req.params.businessId, req.body.category_ids);
  return sendResponse(res, 200, true, req.__('business.categories.updated'), { data });
};

exports.list = async (req, res) => {
  const data = await service.getCategoriesByBusiness(req.params.businessId);
  return sendResponse(res, 200, true, req.__('business.categories.found'),data );
};

exports.listServices = async (req, res) => {
  const data = await service.getCategoriesByBusiness(req.params.businessId);
  return sendResponse(res, 200, true, req.__('business.services.found'), { data });
};

exports.clear = async (req, res) => {
  await service.removeAllCategories(req.params.businessId);
  return sendResponse(res, 200, true, req.__('business.categories.deleted'));
};
