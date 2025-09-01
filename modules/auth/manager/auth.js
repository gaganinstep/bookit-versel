const authService = require('../services/auth.js');
const {
  sendResponse,
  verifyGoogleToken, verifyAppleToken
} = require('../utils/helper.js');
const { getAllModels } = require("../../../middlewares/loadModels");
const { Op } = require('sequelize');

const createMulterMiddleware = require('../../../middlewares/multer');
const CustomError = require('../../../middlewares/customError.js');



exports.deleteUserByID = async (id) => {
  return await authService.deleteUser(id);
};

exports.updateUserById = async (id, data) => {
  return await authService.updateUserById(id, data);
};

exports.deleteUser = async (id) => {
  return await authService.deleteUser(id);
};


exports.getAllUsers = async (query, userId) => {
  return await authService.getAllUsers({ ...query, id: userId });
};

exports.register = async (req, res, roleName) => {
  const { phone, email, full_name, password, oauth_provider, oauth_uid } = req.body;  

  user = await authService.findUser({ email: email.toLowerCase() });
  if (user) {
    return sendResponse(res, 400, true, req.__('auth.email_exists'));
  }
  if (!user) {
    user = await authService.register(
      req,
      {
      phone,
      email,
      full_name, 
      password,
      roleName,
      oauth_provider,
      oauth_uid
    });
  }
  return sendResponse(res, 200, true, req.__('auth.registration_success'), {
    user,
  }); 
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: req.__("auth.email_password_required") });
    }
    const result = await authService.login(req,email, password);

    return res.status(200).json({
      message: req.__("auth.login_success"),
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.socialLogin = async (payload, t) => {
  return await authService.handleSocialLogin(payload, t);
};

exports.businessRegister = async (req, roleName) => {
  const t = req && typeof req.__ === 'function' ? req.__ : (key) => key;

  const { email } = req.body;  
  if (!email) {
    throw new Error(t('auth.email_required'));
  }
  const { User } = await getAllModels(process.env.DB_TYPE);

  const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    
  if (existingUser && existingUser.dataValues.is_active && existingUser.dataValues.is_verified) {
    throw new Error(t('auth.email_exists'));
  }

  return await authService.businessRegister(req.body, t, roleName);
};

exports.getUserById = async (id) => {
  return await authService.findById(id);
};

exports.verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  const t = req && typeof req.__ === 'function' ? req.__ : (k) => k;

  if (!email || !otp) {
    throw { status: 400, message: t("auth.email_otp_required") };
  }

  return await authService.verifyOtp(email.toLowerCase(), otp, t);
};

exports.sendOtp = async (req, res, next) => {
  const { email } = req.body;
  const t = req && typeof req.__ === 'function' ? req.__ : (k) => k;

  if (!email) {
    throw { status: 400, message: t("auth.email_required") };
  }

  return await authService.sendOtp(email.toLowerCase(), t);
};

exports.resendOtp = async (req) => {
  const t = req && typeof req.__ === 'function' ? req.__ : (key) => key;

  const { email } = req.body;
  if (!email) throw new Error(t('auth.email_required'));

  return await authService.resendOtp(email, t);
};

exports.refreshToken = async (refreshToken, req) => {
  const t = req && typeof req.__ === 'function' ? req.__ : (key) => key;

  return await authService.refreshToken(refreshToken, t);
};

exports.getUserBusinessSummary = async (userId) => {
  return await authService.getUserBusinessSummary(userId);
};

exports.updateUserProfile = async (userId, payload) => {
  return await authService.updateUserProfile(userId, payload);
};

exports.initiatePasswordReset = async (req) => {
  const t = req && typeof req.__ === 'function' ? req.__ : (key) => key;
  const { email } = req.body;
  
  if (!email) {
    throw new Error(t('auth.email_required'));
  }

  return await authService.initiatePasswordReset(email.toLowerCase(), t);
};

exports.verifyResetOtp = async (req) => {
  const t = req && typeof req.__ === 'function' ? req.__ : (key) => key;
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    throw new Error(t('auth.email_otp_required'));
  }

  return await authService.verifyResetOtp(email.toLowerCase(), otp, t);
};

exports.resetPassword = async (req) => {
  const t = req && typeof req.__ === 'function' ? req.__ : (key) => key;
  const { email, otp, password, confirm_password } = req.body;
  
  if (!email || !password || !confirm_password) {
    throw new Error(t('auth.all_fields_required'));
  }

  if (password !== confirm_password) {
    throw new Error(t('auth.passwords_dont_match'));
  }

  return await authService.resetPassword(email.toLowerCase(), otp, password, t);
};

exports.changePassword = async (req) => {
  const t = req && typeof req.__ === 'function' ? req.__ : (key) => key;
  const { old_password, new_password, confirm_password } = req.body;
  const userId = req.decoded?.id;
  
  if (!userId) {
    throw new Error(t('auth.user_not_authenticated'));
  }

  if (!old_password || !new_password || !confirm_password) {
    throw new Error(t('auth.all_fields_required'));
  }

  if (new_password !== confirm_password) {
    throw new Error(t('auth.passwords_dont_match'));
  }

  return await authService.changePassword(userId, old_password, new_password, t);
};