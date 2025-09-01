const manager = require('../manager/categories');
const validation = require('../validations/categories');
const { buildSchema } = require('../../../middlewares/joiValidation');
const CustomError = require('../../../middlewares/customError');

exports.createCategory = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createCategory);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.createCategory(req, res);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.updateCategory);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.updateCategory(req, res);
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    return await manager.deleteCategory(req, res);
  } catch (err) {
    next(err);
  }
};

exports.listCategories = async (req, res, next) => {
  try {
    return await manager.listCategories(req, res);
  } catch (err) {
    next(err);
  }
};

// ✅ New controller methods for offering UI
exports.getCategoriesByLevel = async (req, res, next) => {
  try {
    return await manager.getCategoriesByLevel(req, res);
  } catch (err) {
    next(err);
  }
};

exports.getCategoryChildren = async (req, res, next) => {
  try {
    return await manager.getCategoryChildren(req, res);
  } catch (err) {
    next(err);
  }
};
