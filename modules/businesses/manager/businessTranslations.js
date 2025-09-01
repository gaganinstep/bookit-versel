const service = require('../services/businessTranslations');
const { sendResponse } = require('../utils/helper');

exports.upsert = async (req, res) => {
  const translation = await service.upsertTranslation(req.params.businessId, req.body);
  return sendResponse(res, 200, true, req.__('business.translation.saved'), { translation });
};

exports.list = async (req, res) => {
  const translations = await service.getTranslations(req.params.businessId);
  return sendResponse(res, 200, true, req.__('business.translation.listed'), { translations });
};

exports.delete = async (req, res) => {
  await service.deleteTranslation(req.params.businessId, req.params.lang);
  return sendResponse(res, 200, true, req.__('business.translation.deleted'));
};

exports.processStep = async (userId, step, data, req) => {
  const t = req && typeof req.__ === 'function' ? req.__ : (key) => key;

  if (!step || !data) {
    throw new Error(t('business.business_data_step_required'));
  }
  switch (step) {
    case 'about_you':
      return await service.saveBusiness(userId, data, t);
    case 'locations':
      return await service.saveLocations(data, t);
    case 'categories':
      return await service.saveCategories(data, t);
    case 'services':
      return await service.saveServices(data, t);
    case 'service_details':
      return await service.saveServiceDetails(data, t);
    default:
      throw new Error(t('business.business_onboarding_step_invalid'));
  }
};

exports.getOnboardingSummary = async (business_id, req) => {
  const t = req && typeof req.__ === 'function' ? req.__ : (key) => key;
  if (!business_id) {
    throw new Error(t('business.business_id_required'));
  }
  const data = await service.getOnboardingSummary(business_id, t);

  if (!data) {
    return {
      status: 404,
      success: false,
      message: t('business.business_not_found'),
      data: null,
    };
  }

  return {
    status: 200,
    success: true,
    message: t('business.business_onboarding_step_completed'),
    data,
  };
};

exports.getBusinessesBySlug = async (slug) => {
  return await service.getBusinessDetailsBySlug(slug);
};

exports.getLocationSummary = async (slug, t) => {
  return service.getLocationSummary(slug, t);
};

exports.getOtherLocations = async (businessId, currentLocationId) => {
  return await service.getOtherLocations(businessId, currentLocationId);
};

exports.getBusinessServicesById = async (business_id) => {
  return await service.getBusinessServicesById(business_id);
};

exports.getDetails = async (businessId) => {
  return await service.fetchServiceDetails(businessId);
};

exports.createOfferings = async (userId, data, req) => {
  const t = typeof req.__ === 'function' ? req.__ : (k) => k;
  return await service.saveOfferingServiceDetails(data, t);
};

exports.getClassBasedServices = async (business_id) => {
  return await service.getClassBasedServices(business_id);
};

exports.getCreatedOfferings = async (business_id, req) => {
  const t = typeof req.__ === 'function' ? req.__ : (k) => k;
  return await service.getCreatedOfferings(business_id, t);
};

exports.getLevel0CategoriesByBusinessId = async (business_id, req) => {
  const t = typeof req.__ === 'function' ? req.__ : (k) => k;
  return await service.getLevel0CategoriesByBusinessId(business_id, t);
};

exports.getServiceDetailById = async (serviceDetailId, req) => {
  const t = typeof req.__ === 'function' ? req.__ : (k) => k;
  return await service.getServiceDetailById(serviceDetailId);
};

exports.updateServiceDetailById = async (serviceDetailId, updateData, req) => {
  const t = typeof req.__ === 'function' ? req.__ : (k) => k;
  return await service.updateServiceDetailById(serviceDetailId, updateData);
};