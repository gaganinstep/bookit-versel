const manager = require('../manager/classes');
const validation = require('../validations/classes');
const { buildSchema } = require('../../../middlewares/joiValidation');
const CustomError = require('../../../middlewares/customError');
const { sendResponse } = require('../utils/helper');

exports.create = async (req, res, next) => {
  try {
    const data = await manager.create(req.body);
    return sendResponse(res, 201, true, req.__('class.created'), { data });
  } catch (err) {
    next(err);
  }
};

exports.createClassWithSchedule = async (req, res, next) => {
  try {
    console.log('🔍 [CONTROLLER] createClassWithSchedule - Request received');
    console.log('📦 [CONTROLLER] Request body:', JSON.stringify(req.body, null, 2));
    
    // Handle both array and object payload formats
    let payload = req.body;
    if (Array.isArray(req.body)) {
      console.log('📝 [CONTROLLER] Converting array payload to object');
      payload = req.body[0]; // Take the first item if it's an array
    }
    
    const schema = buildSchema(validation.createClassWithSchedule);
    console.log('✅ [CONTROLLER] Schema built successfully');
    
    const { error } = schema.validate(payload);
    if (error) {
      console.log('❌ [CONTROLLER] Validation error:', error.details[0].message);
      return next(new CustomError(error.details[0].message, 400));
    }
    
    console.log('✅ [CONTROLLER] Validation passed, calling manager');
    const data = await manager.createClassWithSchedule(payload);
    
    console.log('✅ [CONTROLLER] Manager returned data:', JSON.stringify(data, null, 2));
    return sendResponse(res, 201, true, req.__('class.created_with_schedule'), { data });
  } catch (err) {
    console.log('❌ [CONTROLLER] Error in createClassWithSchedule:', err.message);
    console.log('❌ [CONTROLLER] Error stack:', err.stack);
    next(err);
  }
};

exports.unifiedClassWithSchedule = async (req, res, next) => {
  try {
    console.log('🔍 [CONTROLLER] unifiedClassWithSchedule - Request received');
    console.log('📦 [CONTROLLER] Request body:', JSON.stringify(req.body, null, 2));
    
    // Handle both array and object payload formats
    let payload = req.body;
    if (Array.isArray(req.body)) {
      console.log('📝 [CONTROLLER] Converting array payload to object');
      payload = req.body[0]; // Take the first item if it's an array
    }
    
    // Handle null/empty id field before validation
    const requestBody = { ...payload };
    if (requestBody.id === null || requestBody.id === '' || requestBody.id === 'null' || requestBody.id === 'undefined' || requestBody.id === undefined) {
      delete requestBody.id;
    }
    
    console.log('📝 [CONTROLLER] Cleaned request body:', JSON.stringify(requestBody, null, 2));
    
    const schema = buildSchema(validation.unifiedClassWithSchedule);
    console.log('✅ [CONTROLLER] Schema built successfully');
    
    const { error } = schema.validate(requestBody);
    if (error) {
      console.log('❌ [CONTROLLER] Validation error:', error.details[0].message);
      return next(new CustomError(error.details[0].message, 400));
    }
    
    console.log('✅ [CONTROLLER] Validation passed, calling manager');
    const data = await manager.unifiedClassWithSchedule(requestBody);
    
    console.log('✅ [CONTROLLER] Manager returned data:', JSON.stringify(data, null, 2));
    
    const isUpdate = !!requestBody.id;
    const message = isUpdate ? req.__('class.updated_with_schedule') : req.__('class.created_with_schedule');
    const statusCode = isUpdate ? 200 : 201;
    
    return sendResponse(res, statusCode, true, message, { data });
  } catch (err) {
    console.log('❌ [CONTROLLER] Error in unifiedClassWithSchedule:', err.message);
    console.log('❌ [CONTROLLER] Error stack:', err.stack);
    next(err);
  }
};

exports.getClassesWithSchedules = async (req, res, next) => {
  try {
    console.log('🔍 [CONTROLLER] getClassesWithSchedules - Request received');
    console.log('📦 [CONTROLLER] Query params:', JSON.stringify(req.query, null, 2));
    
    const data = await manager.getClassesWithSchedules(req.query);
    return sendResponse(res, 200, true, req.__('class.listed_with_schedules'), { data });
  } catch (err) {
    console.log('❌ [CONTROLLER] Error in getClassesWithSchedules:', err.message);
    console.log('❌ [CONTROLLER] Error stack:', err.stack);
    next(err);
  }
};

exports.getClassWithSchedulesById = async (req, res, next) => {
  try {
    console.log('🔍 [CONTROLLER] getClassWithSchedulesById - Request received');
    console.log('📦 [CONTROLLER] Class ID:', req.params.id);
    
    const data = await manager.getClassWithSchedulesById(req.params.id);
    return sendResponse(res, 200, true, req.__('class.found_with_schedules'), { data });
  } catch (err) {
    console.log('❌ [CONTROLLER] Error in getClassWithSchedulesById:', err.message);
    console.log('❌ [CONTROLLER] Error stack:', err.stack);
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    return await manager.get(req, res);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.updateClass);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.update(req, res);
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

exports.list = async (req, res, next) => {
  try {
    return await manager.list(req, res);
  } catch (err) {
    next(err);
  }
};

exports.getByLocation = async (req, res, next) => {
  try {
    return await manager.getByLocation(req, res);
  } catch (err) {
    next(err);
  }
};

exports.getScheduleIdsByClass = async (req, res, next) => {
  try {
    return await manager.getScheduleIdsByClass(req, res);
  } catch (err) {
    next(err);
  }
};

exports.getByBusiness = async (req, res, next) => {
  try {
    return await manager.getByBusiness(req, res);
  } catch (err) {
    next(err);
  }
};
