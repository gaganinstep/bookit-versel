const service = require('../services/appointments');
const { sendResponse } = require('../utils/helper');

exports.create = async (req, res) => {
  const data = await service.create(req.body);
  return sendResponse(res, 201, true, req.__('appointment.created'), { data });
};

exports.list = async (req, res) => {
  if (!req.decoded || !req.decoded.id) {
    return res
      .status(400)
      .json({ message: req.__("auth.user_not_authenticated") });
  }
  if (!req.decoded.id) {
    return res.status(400).json({ message: req.__("auth.user_not_found") });
  }
  const result = await service.list(req.query, req.decoded.id);
  return sendResponse(res, 200, true, req.__("appointment.listed"), {
    total: result.count,
    rows: result.rows,
  });
};

exports.getTodaysAppointmentsByLocation = async (req, res) => {
  const data = await service.getTodaysAppointmentsByLocation(req.params.location_id);
  if (!data) return sendResponse(res, 404, false, req.__('appointment.not_found'));
  return sendResponse(res, 200, true, req.__('appointment.found'), { data });
};

exports.get = async (req, res) => {
  const data = await service.getById(req.params.id);
  if (!data) return sendResponse(res, 404, false, req.__('appointment.not_found'));
  return sendResponse(res, 200, true, req.__('appointment.found'), { data });
};

exports.rescheduledAppointment = async (req, res) => {
  await service.rescheduledAppointment(req.params.id, req.body);
  return sendResponse(res, 200, true, req.__('appointment.updated'));
};

exports.delete = async (req, res) => {
  await service.delete(req.params.id);
  return sendResponse(res, 200, true, req.__('appointment.cancelled'));
};


exports.cancelAppointment = async (req, res) => {
  await service.cancelAppointment(req.params.id, req.body.status_reason);
  return sendResponse(res, 200, true, req.__('appointment.cancelled'));
};