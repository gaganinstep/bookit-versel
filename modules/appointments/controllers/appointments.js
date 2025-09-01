const manager = require('../manager/appointments');
const validation = require('../validations/appointments');
const { buildSchema } = require('../../../middlewares/joiValidation');
const CustomError = require('../../../middlewares/customError');

exports.create = async (req, res, next) => {
  try {
    let appointments = req.body;

    if (!Array.isArray(appointments)) {
      return next(new CustomError("Input should be an array of appointments", 400));
    } 
    const schema = buildSchema(validation.createAppointment);
    for (const appt of appointments) {
      const { error } = schema.validate(appt);
      if (error) return next(new CustomError(error.details[0].message, 400));
    }
    return await manager.create(req, res);
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

exports.getTodaysAppointmentsByLocation = async (req, res, next) => {
  try { 
    return await manager.getTodaysAppointmentsByLocation(req, res);
  } catch (err) {
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

exports.rescheduledAppointment = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.updateAppointment);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.rescheduledAppointment(req, res);
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




exports.cancelAppointment = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.cancelAppointment);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.cancelAppointment(req, res);
  } catch (err) {
    next(err);
  }
};

