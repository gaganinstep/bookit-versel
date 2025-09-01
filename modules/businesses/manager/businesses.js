const businessService = require('../services/businesses');
const { sendResponse } = require('../utils/helper');

exports.createBusiness = async (req, res) => {
  const business = await businessService.createBusiness(req.body);
  return sendResponse(res, 201, true, req.__('business.created'), { business });
};

exports.getBusiness = async (req, res) => {
  const business = await businessService.getBusinessById(req.params.id);
  if (!business) return sendResponse(res, 404, false, req.__('business.not_found'));
  return sendResponse(res, 200, true, req.__('business.found'), { business });
};

exports.updateBusiness = async (req, res) => {
  const data = await businessService.updateBusiness(req.params.id, req.body);
  return sendResponse(res, 200, true, req.__('business.updated'), data);
};

exports.deleteBusiness = async (req, res) => {
  const data = await businessService.deleteBusiness(req.params.id);
  return sendResponse(res, 200, true, req.__('business.deleted'),data);
};

exports.listBusinesses = async (req, res) => {
  const result = await businessService.listBusinesses({...req.query, id: req.decoded.id});
  return sendResponse(res, 200, true, req.__('business.listed'), result);
};

exports.getComprehensiveBusinessServices = async (req, res) => {
  const result = await businessService.getComprehensiveBusinessServices(req.params.businessId, req.query.categoryId);
  return sendResponse(res, 200, true, req.__('business.services.comprehensive.success'), result);
};
