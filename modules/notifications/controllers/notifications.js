const manager = require('../manager/notifications');
const validation = require('../validations/notifications');
const { buildSchema } = require('../../../middlewares/joiValidation');
const CustomError = require('../../../middlewares/customError');

exports.create = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createNotification);
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

exports.get = async (req, res, next) => {
  try {
    return await manager.get(req, res);
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
