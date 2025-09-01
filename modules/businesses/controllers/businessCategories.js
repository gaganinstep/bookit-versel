const manager = require('../manager/businessCategories');
const validation = require('../validations/businessCategories');
const { buildSchema } = require('../../../middlewares/joiValidation');
const CustomError = require('../../../middlewares/customError');

exports.assign = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.assignCategories);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.assign(req, res);
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

exports.listServices = async (req, res, next) => {
  try {
    return await manager.listServices(req, res);
  } catch (err) {
    next(err);
  }
};

exports.clear = async (req, res, next) => {
  try {
    return await manager.clear(req, res);
  } catch (err) {
    next(err);
  }
};
