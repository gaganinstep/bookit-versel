const service = require('../services/classes');
const { sendResponse } = require('../utils/helper');

exports.create = async (data) => {
  return await service.createClassWithSchedule(data);
};

exports.createClassWithSchedule = async (data) => {
  console.log('🔍 [MANAGER] createClassWithSchedule - Called with data');
  console.log('📦 [MANAGER] Input data:', JSON.stringify(data, null, 2));
  
  try {
    const result = await service.createClassWithSchedule(data);
    console.log('✅ [MANAGER] Service returned result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.log('❌ [MANAGER] Error in createClassWithSchedule:', error.message);
    console.log('❌ [MANAGER] Error stack:', error.stack);
    throw error;
  }
};

exports.unifiedClassWithSchedule = async (data) => {
  console.log('🔍 [MANAGER] unifiedClassWithSchedule - Called with data');
  console.log('📦 [MANAGER] Input data:', JSON.stringify(data, null, 2));
  
  try {
    const result = await service.unifiedClassWithSchedule(data);
    console.log('✅ [MANAGER] Service returned result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.log('❌ [MANAGER] Error in unifiedClassWithSchedule:', error.message);
    console.log('❌ [MANAGER] Error stack:', error.stack);
    throw error;
  }
};

exports.getClassesWithSchedules = async (query) => {
  console.log('🔍 [MANAGER] getClassesWithSchedules - Called with query');
  console.log('📦 [MANAGER] Query params:', JSON.stringify(query, null, 2));
  
  try {
    const result = await service.getClassesWithSchedules(query);
    console.log('✅ [MANAGER] Service returned result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.log('❌ [MANAGER] Error in getClassesWithSchedules:', error.message);
    console.log('❌ [MANAGER] Error stack:', error.stack);
    throw error;
  }
};

exports.getClassWithSchedulesById = async (classId) => {
  console.log('🔍 [MANAGER] getClassWithSchedulesById - Called with class ID');
  console.log('📦 [MANAGER] Class ID:', classId);
  
  try {
    const result = await service.getClassWithSchedulesById(classId);
    console.log('✅ [MANAGER] Service returned result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.log('❌ [MANAGER] Error in getClassWithSchedulesById:', error.message);
    console.log('❌ [MANAGER] Error stack:', error.stack);
    throw error;
  }
};

exports.get = async (req, res) => {
  const data = await service.getClassById(req.params.id);
  if (!data) return sendResponse(res, 404, false, req.__('class.not_found'));
  return sendResponse(res, 200, true, req.__('class.found'), { data });
};

exports.update = async (req, res) => {
  await service.updateClass(req.params.id, req.body);
  return sendResponse(res, 200, true, req.__('class.updated'));
};

exports.delete = async (req, res) => {
  await service.deleteClass(req.params.id);
  return sendResponse(res, 200, true, req.__('class.cancelled'));
};

exports.list = async (req, res) => {
  const data = await service.listClasses(req.query);
  return sendResponse(res, 200, true, req.__('class.listed'), {
    total: data.count,
    rows: data.rows
  });
};

exports.getByLocation = async (req, res) => {
  const data = await service.getClassesByLocation(req.params.locationId);
  return sendResponse(res, 200, true, req.__('class.listed'), { data });
};

exports.getScheduleIdsByClass = async (req, res) => {
  const data = await service.getScheduleIdsByClass(req.params.classId);
  if (!data) return sendResponse(res, 404, false, req.__('class.not_found'));
  return sendResponse(res, 200, true, req.__('class.schedule_ids_found'), { data });
};

exports.getByBusiness = async (req, res) => {
  const { businessId } = req.params;
  const { locationId, day, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
  
  const data = await service.getClassesByBusiness(businessId, {
    locationId,
    day,
    page: parseInt(page),
    limit: parseInt(limit),
    sortBy,
    sortOrder: sortOrder.toUpperCase()
  });
  
  return sendResponse(res, 200, true, req.__('class.listed'), {
    data: data.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: data.count,
      totalPages: Math.ceil(data.count / parseInt(limit))
    }
  });
};
