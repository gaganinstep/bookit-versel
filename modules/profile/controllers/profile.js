const { buildSchema } = require('../../../middlewares/joiValidation');
const validation = require('../validations/profile');
const manager = require('../manager/profile');
const CustomError = require('../../../middlewares/customError');
const path = require('path');
const fs = require('fs');
const { sendResponse } = require('../utils/helper');



exports.createStaffProfiles = async (req, res, next) => {
  try {
    let profiles;
    try {
      profiles = JSON.parse(req.body.staffProfiles);
    } catch (e) {
      return next(new CustomError('staffProfiles.isNotArray', 400));
    }

    
    const schema = buildSchema(validation.createStaffProfile);
    const uploadDir = path.join(__dirname, '../../../uploads/staff-profile-images');
    fs.mkdirSync(uploadDir, { recursive: true });
    const fileMap = {};
    (req.files || []).forEach(file => {
      fileMap[file.fieldname] = file;
    });
    for (let i = 0; i < profiles.length; i++) {
      const { error } = schema.validate(profiles[i]);
      if (error) {
        return next(
          new CustomError(`Profile ${i + 1} is invalid: ${error.details[0].message}`, 400)
        );
      }
      const fileKey = `profile_images[${i}]`;
      const file = fileMap[fileKey];

      if (file && file.buffer) {
        const ext = path.extname(file.originalname) || '.jpg';
        const fileName = `${Date.now()}_${i}${ext}`;
        const uploadPath = path.join(uploadDir, fileName);
        fs.writeFileSync(uploadPath, file.buffer);
        profiles[i].profile_photo_url = `/uploads/staff-profile-images/${fileName}`;
      } else {
        profiles[i].profile_photo_url = null;
      }
    }

    req.body.parsedStaffProfiles = profiles;

    const createdProfiles = await manager.createStaffProfiles(req, res);
    return sendResponse(res, 201, true, 'staffProfiles.created', { createdProfiles });
  } catch (err) {
    return next(err);
  }
};


exports.getStaffProfile = async (req, res, next) => {
  try {
    return await manager.getStaffProfile(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.getWholeStaff = async (req, res, next) => {
  try {
    return await manager.getWholeStaff(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.getWholeStaffByBusinessServiceDetail = async (req, res, next) => {
  try {
    return await manager.getWholeStaffByBusinessServiceDetail(req, res);
  } catch (err) {
    return next(err);
  }
};



exports.getStaffProfilesByUserId = async (req, res, next) => {
  try {
    return await manager.getStaffProfilesByUserId(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.getStaffProfilesByLocationsId = async (req, res, next) => {
  try {
    return await manager.getStaffProfilesByLocationsId(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.getStaffSchedule = async (req, res, next) => {
  try {
    return await manager.getStaffSchedule(req, res);
  } catch (err) {
    return next(err);
  }
};
exports.getStaffProfilesByServiceSchedules = async (req, res, next) => {
  try {
    return await manager.getStaffProfilesByServiceSchedules(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.createStaffSchedule = async (req, res, next) => {
  try {
    return await manager.createStaffSchedule(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.updateStaffProfile = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.updateStaffProfile);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.updateStaffProfile(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.deleteStaffProfile = async (req, res, next) => {
  try {
    return await manager.deleteStaffProfile(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.createClientProfile = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createClientProfile);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.createClientProfile(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.getClientProfile = async (req, res, next) => {
  try {
    return await manager.getClientProfile(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.listAllClientProfiles = async (req, res, next) => {
  try {
    return await manager.listAllClientProfiles(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.updateClientProfile = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.updateClientProfile);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.updateClientProfile(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.deleteClientProfile = async (req, res, next) => {
  try {
    return await manager.deleteClientProfile(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.createClientPreference = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createClientPreference);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.createClientPreference(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.getClientPreference = async (req, res, next) => {
  try {
    return await manager.getClientPreference(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.updateClientPreference = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.updateClientPreference);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    return await manager.updateClientPreference(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.deleteClientPreference = async (req, res, next) => {
  try {
    return await manager.deleteClientPreference(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.getStaffProfilesByBusinessId = async (req, res, next) => {
  try {
    return await manager.getStaffProfilesByBusinessId(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.getStaffByCategoryLevel0 = async (req, res) => {
  try {
    const { business_id } = req.params;
    const lang = req.query.preferred_language || 'en-us';
    req.setLocale(lang);

    const userId = req?.decoded?.id;
    if (!userId) return res.status(401).json({ message: req.__('auth.user_not_found') });

    const result = await manager.getStaffByCategoryLevel0(business_id, req);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error in getStaffByCategoryLevel0:', error);
    return res.status(500).json({ success: false, message: req.__('general.server_error') });
  }
};

exports.createOrUpdateStaffWithSchedule = async (req, res, next) => {
  try {
    const schema = buildSchema(validation.createOrUpdateStaffWithSchedule);
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new CustomError(error.details[0].message, 400));
    }

    // Handle file upload if provided
    const uploadDir = path.join(__dirname, '../../../uploads/staff-profile-images');
    fs.mkdirSync(uploadDir, { recursive: true });
    
    if (req.files && req.files.length > 0) {
      const file = req.files[0]; // Take the first file
      if (file && file.buffer) {
        const ext = path.extname(file.originalname) || '.jpg';
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${ext}`;
        const uploadPath = path.join(uploadDir, fileName);
        fs.writeFileSync(uploadPath, file.buffer);
        req.body.profile_photo_url = `/uploads/staff-profile-images/${fileName}`;
      }
    }

    const result = await manager.createOrUpdateStaffWithSchedule(req, res);
    return sendResponse(res, result.statusCode || 200, true, result.message, result.data);
  } catch (err) {
    return next(err);
  }
};

exports.unifiedStaffWithSchedule = async (req, res, next) => {
  try {
    // Extract user_id from JWT token
    if (!req.decoded || !req.decoded.id) {
      return next(new CustomError('User authentication required', 401));
    }
        
    // Handle null/empty id field before validation
    const requestBody = { ...req.body };
    if (requestBody.id === null || requestBody.id === '' || requestBody.id === 'null' || requestBody.id === 'undefined' || requestBody.id === undefined) {
      delete requestBody.id;
    }
    
    // Add user_id from token to request body
    requestBody.user_id = req.decoded.id;
    
    const schema = buildSchema(validation.unifiedStaffWithSchedule);
    const { error } = schema.validate(requestBody);
    if (error) {
      return next(new CustomError(error.details[0].message, 400));
    }
    
    // Update req.body with cleaned data
    req.body = requestBody;
    
    const uploadDir = path.join(__dirname, '../../../uploads/staff-profile-images');
    fs.mkdirSync(uploadDir, { recursive: true });
    
    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      if (file && file.buffer) {
        const ext = path.extname(file.originalname) || '.jpg';
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${ext}`;
        const uploadPath = path.join(uploadDir, fileName);
        fs.writeFileSync(uploadPath, file.buffer);
        req.body.profile_photo_url = `/uploads/staff-profile-images/${fileName}`;
      }
    }
    
    const result = await manager.unifiedStaffWithSchedule(req, res);
    
    return sendResponse(res, result.statusCode || 200, true, result.message, result.data);
  } catch (err) {
    console.error('❌ [CONTROLLER] Error:', err.message);
    return next(err);
  }
};

exports.getStaffWithComprehensiveData = async (req, res, next) => {
  try {
    // Simple validation - check if businessId is provided
    if (!req.params.businessId) {
      return next(new CustomError('Business ID is required', 400));
    }
    
    // Optional validation for staffId format (if provided)
    if (req.params.staffId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.staffId)) {
      return next(new CustomError('Invalid staff ID format. Must be a valid UUID.', 400));
    }
    
    return await manager.getStaffWithComprehensiveData(req, res);
  } catch (err) {
    console.error('❌ [CONTROLLER] Error:', err.message);
    next(err);
  }
};
