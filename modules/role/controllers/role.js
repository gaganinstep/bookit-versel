const { roleInput } = require('../validations/role');
const { buildSchema } = require('../../../middlewares/joiValidation');
const roleManager = require('../manager/role');
const { supportedDbTypes } = require('../utils/staticData');
const { unsupportedDBType } = require('../utils/messages');
const CustomError = require('../../../middlewares/customError');

exports.createRole = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const schema = buildSchema(roleInput);

    const { error } = schema.validate(req.body);
    if (error) {return next(new CustomError(error.details[0].message, 400));}

    const result = await roleManager.createRole(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getRoles = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const result = await roleManager.getRoles(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getRolePermissionList = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const result = await roleManager.getRolePermissionList(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getRoleDetail = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const result = await roleManager.getRoleDetail(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};
