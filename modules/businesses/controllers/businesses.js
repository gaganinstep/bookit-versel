const manager = require('../manager/businesses');
const { buildSchema } = require('../../../middlewares/joiValidation');
const validation = require('../validations/businesses');
const CustomError = require('../../../middlewares/customError');

exports.createBusiness = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createBusiness);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.createBusiness(req, res);
  } catch (err) {
    next(err);
  }
};

exports.getBusiness = async (req, res, next) => {
  try {
    return await manager.getBusiness(req, res);
  } catch (err) {
    next(err);
  }
};

exports.updateBusiness = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.updateBusiness);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.updateBusiness(req, res);
  } catch (err) {
    next(err);
  }
};

exports.deleteBusiness = async (req, res, next) => {
  try {
    return await manager.deleteBusiness(req, res);
  } catch (err) {
    next(err);
  }
};

exports.listBusinesses = async (req, res, next) => {
  try {
    if (!req.decoded || !req.decoded.id) {
      return res.status(400).json({ message: req.__('auth.user_not_authenticated') });
    }
    if (!req.decoded.id) {
      return res.status(400).json({ message: req.__('auth.user_not_found') });
    }
    const businesses = await manager.listBusinesses(req, res);
    return res.json(businesses);
  } catch (err) {
    next(err);
  }
};

exports.getComprehensiveBusinessServices = async (req, res, next) => {
  try {
    // Simple validation - check if businessId is provided
    if (!req.params.businessId) {
      return next(new CustomError('Business ID is required', 400));
    }
    
    // Optional validation for categoryId format (if provided)
    if (req.query.categoryId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.query.categoryId)) {
      return next(new CustomError('Invalid category ID format. Must be a valid UUID.', 400));
    }
    
    return await manager.getComprehensiveBusinessServices(req, res);
  } catch (err) {
    console.error('❌ [CONTROLLER] Error:', err.message);
    next(err);
  }
};
