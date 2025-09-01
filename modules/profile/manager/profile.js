const profileService = require('../services/profile');
const { sendResponse } = require('../utils/helper');

exports.createStaffProfiles = async (req, res) => {
  const profile = await profileService.createStaffProfile(req.body.parsedStaffProfiles);
  return sendResponse(res, 201, true, req.__('profile.created'), { profile });
};

exports.getStaffProfile = async (req, res) => {
  const profile = await profileService.getStaffProfileById(req.params.id);
  if (!profile) {
    return sendResponse(res, 404, false, req.__('profile.not_found'));
  }
  return sendResponse(res, 200, true, req.__('profile.found'), { profile });
};

exports.getWholeStaff = async (req, res) => {
  const result = await profileService.getWholeStaff(req.query);
  return sendResponse(res, 200, true, req.__('staff.listed'), {
    total: result.count,
    rows: result.rows
  });
};

exports.getWholeStaffByBusinessServiceDetail = async (req, res) => {
  const result = await profileService.getWholeStaffByBusinessServiceDetail(req.query);
  return sendResponse(res, 200, true, req.__('staff.listed'), {
    result
  });
};

exports.getStaffProfilesByUserId = async (req, res) => {
  const profiles = await profileService.getStaffProfilesByUserId(req.params.id, req.query);
  if (!profiles) {
    return sendResponse(res, 404, false, req.__('profiles.not_found'));
  }
  return sendResponse(res, 200, true, req.__('profiles.found'), { profiles });
};

exports.getStaffProfilesByBusinessId = async (req, res) => {
  const profiles = await profileService.getStaffProfilesByBusinessId(req.params.businessId);
  if (!profiles) {
    return sendResponse(res, 404, false, req.__('profiles.not_found'));
  }
  return sendResponse(res, 200, true, req.__('profiles.found'), { profiles });
};

exports.getStaffProfilesByLocationsId = async (req, res) => {
  const profiles = await profileService.getStaffProfilesByLocationsId(req.params.id);
  if (!profiles) {
    return sendResponse(res, 404, false, req.__('profiles.not_found'));
  }
  return sendResponse(res, 200, true, req.__('profiles.found'), { profiles });
};

exports.getStaffSchedule = async (req, res) => {
  const schedule = await profileService.getStaffSchedule(req.params.id);
  if (!schedule) {
    return sendResponse(res, 404, false, req.__('staff_schedule.not_found'));
  }
  return sendResponse(res, 200, true, req.__('staff_schedule.found'), { schedule });
};

exports.getStaffProfilesByServiceSchedules = async (req, res) => {
  const schedule = await profileService.getStaffProfilesByServiceSchedules(req.params.location_id);
  if (!schedule) {
    return sendResponse(res, 404, false, req.__('staff_schedule.not_found'));
  }
  return sendResponse(res, 200, true, req.__('staff_schedule.found'), { schedule });
};

exports.createStaffSchedule = async (req, res) => {
  const schedules = await profileService.createStaffSchedule(req.params.id, req.body);
  if (!schedules) {
    return sendResponse(res, 400, false, req.__('schedules.not_created'));
  }
  return sendResponse(res, 201, true, req.__('schedules.created'), { schedules });
};

exports.updateStaffProfile = async (req, res) => {
  await profileService.updateStaffProfile(req.params.id, req.body);
  return sendResponse(res, 200, true, req.__('profile.updated'));
};

exports.deleteStaffProfile = async (req, res) => {
  await profileService.deleteStaffProfile(req.params.id);
  return sendResponse(res, 200, true, req.__('profile.deleted'));
};

exports.createClientProfile = async (req, res) => {
  const { profile, error } = await profileService.createClientProfile(req.body);

  if (error) {
    return sendResponse(res, 409, false, error.message, { error });
  }

  return sendResponse(res, 201, true, req.__('profile.client_created'), { profile });
};


exports.getClientProfile = async (req, res) => {
  const profile = await profileService.getClientProfileById(req.params.id);
  if (!profile) {
    return sendResponse(res, 404, false, req.__('profile.not_found'));
  }
  return sendResponse(res, 200, true, req.__('profile.client_found'), { profile });
};

exports.listAllClientProfiles = async (req, res) => {
  const profile = await profileService.listAllClientProfiles(req.query);
  if (!profile) {
    return sendResponse(res, 404, false, req.__('profile.not_found'));
  }
  return sendResponse(res, 200, true, req.__('profile.client_found'), { profile });
};

exports.updateClientProfile = async (req, res) => {
  await profileService.updateClientProfile(req.params.id, req.body);
  return sendResponse(res, 200, true, req.__('profile.client_updated'));
};

exports.deleteClientProfile = async (req, res) => {
  await profileService.deleteClientProfile(req.params.id);
  return sendResponse(res, 200, true, req.__('profile.client_deleted'));
};

exports.createClientPreference = async (req, res) => {
  const pref = await profileService.createClientPreference(req.body);
  return sendResponse(res, 201, true, req.__('preference.created'), { pref });
};

exports.getClientPreference = async (req, res) => {
  const pref = await profileService.getClientPreferenceByUserId(req.params.user_id);
  if (!pref) {
    return sendResponse(res, 404, false, req.__('preference.not_found'));
  }
  return sendResponse(res, 200, true, req.__('preference.found'), { pref });
};

exports.updateClientPreference = async (req, res) => {
  await profileService.updateClientPreference(req.params.user_id, req.body);
  return sendResponse(res, 200, true, req.__('preference.updated'));
};

exports.deleteClientPreference = async (req, res) => {
  await profileService.deleteClientPreference(req.params.user_id);
  return sendResponse(res, 200, true, req.__('preference.deleted'));
};

exports.getStaffByCategoryLevel0 = async (businessId, req) => {
  const t = typeof req.__ === 'function' ? req.__ : (k) => k;
  return await profileService.getStaffByCategoryLevel0(businessId);
};

exports.createOrUpdateStaffWithSchedule = async (req, res) => {
  const result = await profileService.createOrUpdateStaffWithSchedule(req.body);
  return sendResponse(res, result.statusCode || 200, true, req.__(result.message), result.data);
};

exports.unifiedStaffWithSchedule = async (req, res) => {
  const result = await profileService.unifiedStaffWithSchedule(req.body);  
  return result; // Return result object instead of calling sendResponse
};

exports.getStaffWithComprehensiveData = async (req, res) => {
  const result = await profileService.getStaffWithComprehensiveData(req.params.businessId, req.params.staffId);
  return sendResponse(res, 200, true, req.__('staff.comprehensive.success'), result);
};


