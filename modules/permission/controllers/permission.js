const {
  permissionInput,
  rolePermissionCreateInput,
  rolePermissionUpdateInput,
  permissionUpdateInput,
} = require("../validations/permission");
const { buildSchema } = require("../../../middlewares/joiValidation");
const permissionManager = require("../manager/permission");
const { supportedDbTypes } = require("../utils/staticData");
const { unsupportedDBType } = require("../utils/messages");
const CustomError = require("../../../middlewares/customError");

exports.create = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const schema = buildSchema(permissionInput);

    const { error } = schema.validate(req.body);
    if (error) {
      return next(new CustomError(error.details[0].message, 400));
    }

    const result = await permissionManager.create(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.updateRolePermission = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const schema = buildSchema(rolePermissionUpdateInput);

    const { error } = schema.validate(req.body);
    if (error) {
      return next(new CustomError(error.details[0].message, 400));
    }

    const result = await permissionManager.updateRolePermission(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.createRolePermission = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const schema = buildSchema(rolePermissionCreateInput);

    const { error } = schema.validate(req.body);
    if (error) {
      return next(new CustomError(error.details[0].message, 400));
    }

    const result = await permissionManager.createRolePermission(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getPermissions = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const result = await permissionManager.getPermissions(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getSelectedPermissions = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const result = await permissionManager.getSelectedPermissions(
      req,
      res,
      next
    );
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.updatePermission = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const schema = buildSchema(permissionUpdateInput);

    const { error } = schema.validate(req.body);
    if (error) {
      return next(new CustomError(error.details[0].message, 400));
    }
    const result = await permissionManager.updatePermission(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.deletePermission = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const result = await permissionManager.deletePermission(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};
