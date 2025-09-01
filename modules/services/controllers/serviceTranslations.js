const manager = require('../manager/serviceTranslations');
const validation = require('../validations/serviceTranslations');
const { buildSchema } = require('../../../middlewares/joiValidation');
const CustomError = require('../../../middlewares/customError');

exports.upsert = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createOrUpdate);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.upsert(req, res);
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

exports.delete = async (req, res, next) => {
  try {
    return await manager.delete(req, res);
  } catch (err) {
    next(err);
  }
};
