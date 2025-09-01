const manager = require('../manager/businessTranslations');
const validation = require('../validations/businessTranslations');
const { buildSchema } = require('../../../middlewares/joiValidation');
const CustomError = require('../../../middlewares/customError');
const { sendResponse } = require('../utils/helper');

exports.upsert = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createTranslation);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.upsert(req, res);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    return await manager.list(req, res);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    return await manager.delete(req, res);
  } catch (err) {
    next(err);
  }
};

exports.handleOnboarding = async (req, res) => {
  try {    
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    const { step, data } = req.body;
    const userId = req?.decoded?.id;
     if(!userId){
      return res.status(400).json({ message: req.__('auth.user_not_found') });
    }

    if (!step || !data) return res.status(400).json({ success: false, message: req.__('business.business_data_step_required') });

    const result = await manager.processStep(userId, step, data, req);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error in onboarding:', error);
    return res.status(500).json({ success: false, message: req.__('general.server_error') });
  }
};

exports.getOnboardingSummary = async (req, res) => {
  try {    
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    const { businessId } = req.params;
    const result = await manager.getOnboardingSummary(businessId, req);

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('Error in getOnboardingSummary controller:', error);
    return res.status(500).json({ success: false, message: req.__('general.internal_server_error') });
  }
};

exports.getBusinessesBySlug = async (req, res) => {
  try {
    const result = await manager.getBusinessesBySlug(req.params.slug);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error in getBusinessesBySlug:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getLocationSummary = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await manager.getLocationSummary(slug, req.t);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error in getLocationSummary:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Something went wrong',
    });
  }
};

exports.getOtherLocations = async (req, res, next) => {
  try {
    const { businessId, currentLocationId } = req.params;

    const otherLocations = await manager.getOtherLocations(businessId, currentLocationId);

    return res.status(200).json({
      success: true,
      data: otherLocations,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBusinessServicesById = async (req, res, next) => {
  try {
    const businessServices = await manager.getBusinessServicesById(req.params.id);
    return res.status(200).json({
      ...businessServices,
    });
  } catch (error) {
    next(error);
  }
};

exports.getServiceDetailsByBusiness = async (req, res, next) => {
  try {
    const businessId = req.params.business_id;
    const data = await manager.getDetails(businessId);
    return sendResponse(res, 200, true, 'Fetched business services successfully', { data });
  } catch (err) {
    next(err);
  }
};

exports.createOfferings = async (req, res) => {
  try {
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);
    
    // Check if the payload is already wrapped in data object
    let payload = req.body;
    if (!req.body.data && req.body.details) {
      // Wrap the payload in data object if it's not already wrapped
      payload = { data: req.body };
    }
        
    // Validate payload
    const { error } = validation.createOfferings.validate(payload);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const data = payload.data;
    const userId = req?.decoded?.id;

    if (!userId) return res.status(401).json({ message: req.__('auth.user_not_found') });
    if (!data || !data.details) return res.status(400).json({ message: req.__('business.business_data_required') });

    const result = await manager.createOfferings(userId, data, req);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error in createOfferings:', error);
    return res.status(500).json({ success: false, message: req.__('general.server_error') });
  }
};

exports.getClassBasedServices = async (req, res, next) => {
  try {
    const { business_id } = req.params;
    const data = await manager.getClassBasedServices(business_id);
    return sendResponse(res, 200, true, 'Class-based services fetched successfully', { data });
  } catch (err) {
    next(err);
  }
};

exports.getCreatedOfferings = async (req, res) => {
  try {
    const { business_id } = req.params;
    const lang = req.query.preferred_language || 'en-us';
    req.setLocale(lang);

    const userId = req?.decoded?.id;
    if (!userId) return res.status(401).json({ message: req.__('auth.user_not_found') });

    const result = await manager.getCreatedOfferings(business_id, req);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error in getCreatedOfferings:', error);
    return res.status(500).json({ success: false, message: req.__('general.server_error') });
  }
};

exports.getLevel0CategoriesByBusinessId = async (req, res) => {
  try {
    const { business_id } = req.params;
    const lang = req.query.preferred_language || 'en-us';
    req.setLocale(lang);

    const userId = req?.decoded?.id;
    if (!userId) return res.status(401).json({ message: req.__('auth.user_not_found') });

    const result = await manager.getLevel0CategoriesByBusinessId(business_id, req);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error in getLevel0CategoriesByBusinessId:', error);
    return res.status(500).json({ success: false, message: req.__('general.server_error') });
  }
};

exports.getServiceDetailById = async (req, res) => {
  try {
    const { service_detail_id } = req.params;
    const lang = req.query.preferred_language || 'en-us';
    req.setLocale(lang);

    const userId = req?.decoded?.id;
    if (!userId) return res.status(401).json({ message: req.__('auth.user_not_found') });

    const result = await manager.getServiceDetailById(service_detail_id, req);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error in getServiceDetailById:', error);
    return res.status(500).json({ success: false, message: req.__('general.server_error') });
  }
};

exports.updateServiceDetailById = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.updateServiceDetail);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const { service_detail_id } = req.params;
    const updateData = req.body;
    const lang = req.query.preferred_language || 'en-us';
    req.setLocale(lang);

    const userId = req?.decoded?.id;
    if (!userId) return res.status(401).json({ message: req.__('auth.user_not_found') });

    const result = await manager.updateServiceDetailById(service_detail_id, updateData, req);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in updateServiceDetailById:', error);
    return res.status(500).json({ success: false, message: req.__('general.server_error') });
  }
};