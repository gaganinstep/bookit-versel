const manager = require('../manager/locations');
const validation = require('../validations/locations');
const { buildSchema } = require('../../../middlewares/joiValidation');
const CustomError = require('../../../middlewares/customError');

exports.createLocation = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createLocation);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.createLocation(req, res);
  } catch (err) {
    next(err);
  }
};

exports.getLocation = async (req, res, next) => {
  try {
    return await manager.getLocation(req, res);
  } catch (err) {
    next(err);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.updateLocation);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.updateLocation(req, res);
  } catch (err) {
    next(err);
  }
};

exports.deleteLocation = async (req, res, next) => {
  try {
    return await manager.deleteLocation(req, res);
  } catch (err) {
    next(err);
  }
};

exports.listLocations = async (req, res, next) => {
  try {
    return await manager.listLocations(req, res);
  } catch (err) {
    next(err);
  }
};
