const manager = require('../manager/schedules');
const validation = require('../validations/schedules');
const { buildSchema } = require('../../../middlewares/joiValidation');
const CustomError = require('../../../middlewares/customError');

exports.create = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createSchedule);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
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

exports.listByBusiness = async (req, res, next) => {
  try {
    return await manager.listByBusiness(req, res);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.updateSchedule);
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
