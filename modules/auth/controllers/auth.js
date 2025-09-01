const {
  registerInput,
  loginInput,
  businessRegisterInput,
  initiatePasswordResetInput,
  verifyResetOtpInput,
  resetPasswordInput,
  changePasswordInput
} = require('../validations/auth');
const { buildSchema } = require('../../../middlewares/joiValidation');
const authManager = require('../manager/auth');
const { supportedDbTypes } = require('../utils/staticData');
const { unsupportedDBType } = require('../utils/messages');
const CustomError = require('../../../middlewares/customError');
const { sendResponse } = require('../utils/helper.js');





exports.getAllUsers = async (req, res, next) => {
  try {
    const { id } = req.decoded || {};
    if (!id) {
      return res.status(400).json({ message: req.__('auth.user_not_authenticated') });
    }

    const users = await authManager.getAllUsers(req.query, id);
    return res.json(users);
  } catch (error) {
    next(error);
  }
};




exports.deleteUserByID = async (req, res, next) => {
  try {
    if (!req.decoded || !req.decoded.id) {
      return res.status(400).json({ message: req.__('auth.user_not_authenticated') });
    }

    const result = await authManager.deleteUserByID(req.params.id);

    if (!result.success) {
      return res.status(result.status || 400).json(result);
    }

    return res.status(result.status).json(result);

  } catch (error) {
    next(error);
  }
};


exports.updateUserById = async (req, res, next) => {
  try {
    if (!req.decoded || !req.decoded.id) {
      return res.status(400).json({ message: req.__('auth.user_not_authenticated') });
    }
    if(!req.decoded.id){
      return res.status(400).json({ message: req.__('auth.user_not_found') });
    } 
    
    const result = await authManager.updateUserById(req.params.id, req.body);
    return res.status(200).json({ message: 'Update successful', data: result });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (!req.decoded || !req.decoded.id) {
      return res.status(400).json({ message: req.__('auth.user_not_authenticated') });
    }
    if(!req.decoded.id){
      return res.status(400).json({ message: req.__('auth.user_not_found') });
    } 
    
    const result = await authManager.deleteUser(req.decoded.id);
    return res.status(200).json({ message: 'Deleted successful', data: result });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
     const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const roleName = req.path.split('/').pop();    
    const schema = buildSchema(registerInput);

    const { error } = schema.validate(req.body);
    if (error) {return next(new CustomError(error.details[0].message, 400));}

    const result = await authManager.register(req, res, roleName);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);
    const schema = buildSchema(loginInput);

    const { error } = schema.validate(req.body);
    if (error) {return next(new CustomError(error.details[0].message, 400));}

    const result = await authManager.login(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.userRegister = async (req, res, next) => {
  try {
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    const schema = buildSchema(businessRegisterInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.businessRegister(req, 'user');
    return sendResponse(res, 201, true, req.__('auth.registration_success'), result);

  } catch (err) {
    console.error("Controller Error:", err);
    return next(new CustomError(err.message, 409));
  }
};

exports.businessRegister = async (req, res, next) => {
  try {
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    const schema = buildSchema(businessRegisterInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.businessRegister(req, 'admin');
    return sendResponse(res, 201, true, req.__('auth.registration_success'), result);

  } catch (err) {
    console.error("Controller Error:", err);
    return next(new CustomError(err.message, 409));
  }
};

exports.adminRegister = async (req, res, next) => {
  try {
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    const schema = buildSchema(businessRegisterInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.businessRegister(req, 'superadmin');
    return sendResponse(res, 201, true, req.__('auth.registration_success'), result);

  } catch (err) {
    console.error("Controller Error:", err);
    return next(new CustomError(err.message, 409));
  }
};

exports.getMe = async (req, res) => {
  try {    
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    if (!req.decoded || !req.decoded.id) {
      return res.status(400).json({ message: req.__('auth.user_not_authenticated') });
    }
    if(!req.decoded.id){
      return res.status(400).json({ message: req.__('auth.user_not_found') });
    }

    const user = await authManager.getUserById(req.decoded.id);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: req.__('general.server_error') });
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    const result = await authManager.verifyOtp(req, res, next);
    return sendResponse(res, 200, true, req.__('auth.otp_verified'), result);
  } catch (err) {
    return next(new CustomError(err.message, err.status || 500));
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    const result = await authManager.resendOtp(req);
    return sendResponse(res, 200, true, req.__('auth.otp_sent'), result);
  } catch (err) {
    console.error("Resend OTP Controller Error:", err);
    return next(new CustomError(err.message, 400));
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);
    
    const { refresh_token } = req.body;
    const result = await authManager.refreshToken(refresh_token, req);
    res.status(result.status).json(result);
  } catch (err) {
    console.error('Error in refreshToken:', err);
    res.status(500).json({ success: false, message: req.__('auth.server_error') });
  }
};

exports.getUserBusinessSummary = async (req, res) => {
  try {
    const result = await authManager.getUserBusinessSummary(req.params.user_id);
    res.status(result.status).json(result);
  } catch (err) {
    console.error('Error in getUserBusinessSummary:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const result = await authManager.updateUserProfile(req?.decoded?.id, req.body);
    res.status(result.status).json(result);
  } catch (err) { 
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.socialLogin = async (req, res) => {
  const t = typeof req.t === 'function' ? req.t : (key) => key; // fallback to identity function

  try {
    const response = await authManager.socialLogin(req.body, t);
    return res.status(200).json(response);
  } catch (err) {
    console.error('Social Login Error:', err);
    return res.status(500).json({ success: false, message: t('auth.internal_error') });
  }
};

exports.initiatePasswordReset = async (req, res, next) => {
  try {
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    const schema = buildSchema(initiatePasswordResetInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.initiatePasswordReset(req);
    return sendResponse(res, 200, true, req.__('auth.otp_sent'), result);
  } catch (err) {
    return next(new CustomError(err.message, err.status || 500));
  }
};

exports.verifyResetOtp = async (req, res, next) => {
  try {
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    const schema = buildSchema(verifyResetOtpInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.verifyResetOtp(req);
    return sendResponse(res, 200, true, req.__('auth.otp_verified'), result);
  } catch (err) {
    return next(new CustomError(err.message, err.status || 500));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    const schema = buildSchema(resetPasswordInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.resetPassword(req);
    return sendResponse(res, 200, true, req.__('auth.password_reset_success'), result);
  } catch (err) {
    return next(new CustomError(err.message, err.status || 500));
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const lang = req.body.preferred_language || 'en-us';
    req.setLocale(lang);

    const schema = buildSchema(changePasswordInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.changePassword(req);
    return sendResponse(res, 200, true, req.__('auth.password_changed_success'), result);
  } catch (err) {
    return next(new CustomError(err.message, err.status || 500));
  }
};