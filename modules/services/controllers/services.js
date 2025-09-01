const manager = require('../manager/services');
const validation = require('../validations/services');
const { buildSchema } = require('../../../middlewares/joiValidation');
const CustomError = require('../../../middlewares/customError');

exports.create = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createService);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.create(req, res);
  } catch (err) {
    next(err);
  }
};

exports.getServiceById = async (req, res, next) => {
  try {
    return await manager.getServiceById(req, res);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.updateService);
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
