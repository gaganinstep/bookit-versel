const locationService = require('../services/locations');
const { sendResponse } = require('../utils/helper');

exports.createLocation = async (req, res) => {
  const location = await locationService.createLocation(req.params.businessId, req.body);
  return sendResponse(res, 201, true, req.__('location.created'), { location });
};

exports.getLocation = async (req, res) => {
  const location = await locationService.getLocationById(req.params.id);
  if (!location) return sendResponse(res, 404, false, req.__('location.not_found'));
  return sendResponse(res, 200, true, req.__('location.found'), { location });
};

exports.updateLocation = async (req, res) => {
  await locationService.updateLocation(req.params.id, req.body);
  return sendResponse(res, 200, true, req.__('location.updated'));
};

exports.deleteLocation = async (req, res) => {
  await locationService.deleteLocation(req.params.id);
  return sendResponse(res, 200, true, req.__('location.deleted'));
};

exports.listLocations = async (req, res) => {
  const data = await locationService.listLocations(req.params.businessId, req.query);
  return sendResponse(res, 200, true, req.__('location.listed'), {
    total: data.count,
    rows: data.rows
  });
};
