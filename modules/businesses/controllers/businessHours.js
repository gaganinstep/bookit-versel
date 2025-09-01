const manager = require('../manager/businessHours');
const validation = require('../validations/businessHours');
const { buildSchema } = require('../../../middlewares/joiValidation');
const CustomError = require('../../../middlewares/customError');

exports.setHour = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createOrUpdateHour);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.setHour(req, res);
  } catch (err) {
    next(err);
  }
};

exports.getHours = async (req, res, next) => {
  try {
    return await manager.getHours(req, res);
  } catch (err) {
    next(err);
  }
};

exports.deleteHour = async (req, res, next) => {
  try {
    return await manager.deleteHour(req, res);
  } catch (err) {
    next(err);
  }
};
