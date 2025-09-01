const { getAllModels } = require("../../../middlewares/loadModels");
const redisClient = require("../../../config/redis");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const { generateAccessToken } = require("../utils/helper");
const { sendOtpEmail } = require("../../../utils/emailService");

const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

const { JWT_SECRET, REFRESH_TOKEN_SECRET, JWT_ACCESS_EXPIRATION_TIME, JWT_REFRESH_EXPIRATION_TIME } = process.env;


const updateUserById = async (id, data) => {
  const { User } = await getAllModels(process.env.DB_TYPE);

  const user = await User.findByPk(id);
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }

  await User.update(data, { where: { id } });

  const updatedUser = await User.findByPk(id, {
    attributes: ['id', 'full_name', 'slug', 'email', 'phone', 'preferred_language', 'is_active'],
  });

  return updatedUser;
};



const deleteUser = async (id) => {
  const {
    User,
    StaffProfile,
    StaffSchedule,
    ClientProfile,
    ClientPreference,
    Appointment,
    Notification,
    UserRole,
    Business,
    Class,
    PhotoGallery,
    sequelize,
  } = await getAllModels(process.env.DB_TYPE);

  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(id, { transaction: t });
    if (!user) {
      await t.rollback();
      return { status: 404, success: false, message: 'User not found' };
    }

    const staffProfile = await StaffProfile.findOne({ where: { user_id: id }, transaction: t });

    if (staffProfile) {
      await StaffSchedule.destroy({ where: { staff_profile_id: staffProfile.id }, transaction: t });
      await Class.destroy({ where: { staff_profile_id: staffProfile.id }, transaction: t });
      await StaffProfile.destroy({ where: { user_id: id }, transaction: t });
    }

    await Promise.all([
      Notification.destroy({ where: { user_id: id }, transaction: t }),
      ClientProfile.destroy({ where: { user_id: id }, transaction: t }),
      ClientPreference.destroy({ where: { user_id: id }, transaction: t }),
      Business.destroy({ where: { user_id: id }, transaction: t }),
      PhotoGallery.destroy({ where: { created_by: id }, transaction: t }),
      UserRole.destroy({ where: { userId: id }, transaction: t }),
      Appointment.destroy({ where: { booked_by: id }, transaction: t }),
      Appointment.destroy({ where: { user_id: id }, transaction: t }),
    ]);

    await user.destroy({ transaction: t });

    await t.commit();

    return {
      status: 200,
      success: true,
      message: 'User and associated data deleted successfully',
    };

  } catch (error) {
    await t.rollback();
    throw error;
  }
};


const getAllUsers = async ({ 
  q,
role,
id,
limit,
offset = 0,
page,
}) => {
  const { User } = await getAllModels(process.env.DB_TYPE);

  const where = { is_active: true };

  if (id) {
    where.id = { [Op.ne]: id };
  }

  if(role) {
    where.role = role;
  }

  if (q) {
    where[Op.or] = [
      { full_name: { [Op.iLike]: `%${q}%` } },
      { email: { [Op.iLike]: `%${q}%` } },
      { phone: { [Op.iLike]: `%${q}%` } },
    ];
  }


  if(limit != undefined) limit = parseInt(limit, 10);
  offset = parseInt(offset, 10);
  page = page !== undefined ? parseInt(page, 10) : undefined;

 if (!isNaN(page) && page > 0) {
    offset = (page - 1) * limit;
  }

  const { count, rows } = await User.findAndCountAll({
     where,
    limit,
    offset,
    order: [["full_name", "ASC"]],
    attributes: [
      "id",
      "full_name",
      "slug",
      "email",
      "phone",
      "is_verified",
      "is_active",
      "preferred_language",
      "role",
      "timezone",
      "createdAt",
      "updatedAt"
    ],
  });


  const totalPages = limit > 0 ? Math.ceil(count / limit) : 0;
  const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;


  return {
    items: rows,
    count,
    limit,
    offset,
    currentPage,
    totalPages,
  };
};



const findUser = async (where) => {
  if (typeof where !== "object" || Object.keys(where).length === 0) {
    throw { message: "Invalid where condition" };
  }
  const { User, Role, Permission } = await getAllModels(process.env.DB_TYPE);
  let user = null;
  const includes = [];
  const roleIncludes = [];
  if (Permission) {
    roleIncludes.push({
      model: Permission,
      attributes: ["name", "description", "route", "type", "action"],
      as: "permissions",
    });
  }
  if (Role) {
    includes.push({
      model: Role,
      attributes: ["name", "description"],
      as: "roles",
      include: roleIncludes,
    });
  }

  user = await User.findOne({
    where,
    include: includes,
  });

  return user;
};

const register = async (req, requestBody) => {
  const t = req && typeof req.__ === 'function' ? req.__ : (key) => key;

  if (typeof requestBody !== "object" || Object.keys(requestBody).length === 0) {
    throw new Error(t('auth.internal_error'));
  }

  const { phone, email, full_name, password, roleName, oauth_provider, oauth_uid } = requestBody;
  const { User, Role, UserRole, sequelize } = await getAllModels(process.env.DB_TYPE);
  const transaction = await sequelize.transaction();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error(t('auth.invalid_role'));
    }

    const prevUser = await User.findOne({ where: { email } });

    if (prevUser) {
      await prevUser.update({
        phone,
        full_name,
        password: hashedPassword,
        oauth_provider,
        oauth_uid,
        is_verified: true,
        is_active: true,
      }, { transaction });

      const userRole = await UserRole.findOne({ where: { userId: prevUser.id } });
      if (userRole && userRole.roleId !== role.id) {
        await userRole.update({ roleId: role.id }, { transaction });
      }

      await transaction.commit();

      return {
        id: prevUser.id,
        full_name: prevUser.full_name,
      };
    }

    const newUser = await User.create({
      id: uuidv4(),
      full_name,
      phone,
      email,
      password: hashedPassword,
      oauth_provider,
      oauth_uid,
      preferred_language: "en-us",
      is_verified: true,
      is_active: true,
    }, { transaction });

    await UserRole.create({
      userId: newUser.id,
      roleId: role.id,
    }, { transaction });

    await transaction.commit();

    return {
      id: newUser.id,
      full_name: newUser.full_name,
    };
  } catch (err) {
    await transaction.rollback();
    console.error("Registration error:", err);
    throw new Error(t('auth.internal_error'));
  }
};

const login = async (req, email, password) => {
  const { sequelize } = await getAllModels(process.env.DB_TYPE);
  const transaction = await sequelize.transaction();
  try {
    const user = await findUser({ email });

    if (!user) {
      throw { status: 401, message: req.__("auth.email_not_found") };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw { status: 401, message: req.__("auth.incorrect_password") };
    }

    const token = await generateAccessToken(user);
    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRATION_TIME }
    );

    return {
      token,
      refresh_token: refreshToken,
      user: {
        email: user.email,
        full_name: user.full_name,
        preferred_language: user.preferred_language,
        isVerified: user.is_verified,
      }
    };
  } catch (err) {
    await transaction.rollback();
    console.error("Login error:", err);
    if (err.status && err.message) throw err;
    throw { status: 500, message: req.__("auth.internal_error") };
  }
};
const businessRegister = async (requestBody, t, roleName) => {
  const { phone, email, full_name, password } = requestBody;
  const { User, Role, UserRole, sequelize } = await getAllModels(process.env.DB_TYPE);
  const transaction = await sequelize.transaction();

  const slugifyBase = (str) => str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

  const generateUniqueSlug = async (Model, baseName, attempt = 0) => {
    const baseSlug = slugifyBase(baseName);
    const suffix = `-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalSlug = `${baseSlug}${attempt === 0 ? '' : suffix}`;

    const exists = await Model.findOne({ where: { slug: finalSlug } });
    if (exists) return generateUniqueSlug(Model, baseName, attempt + 1);
    return finalSlug;
  };

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error(t('auth.email_already_exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) throw new Error(t('auth.invalid_role'));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const slug = await generateUniqueSlug(User, full_name);

    const newUser = await User.create({
      id: uuidv4(),
      full_name,
      email,
      phone,
      password_hash: hashedPassword,
      preferred_language: "en-us",
      is_verified: false,
      is_active: false,
      role: roleName,
      slug,
      otp,
      otp_expires: otpExpires,
    }, { transaction });

    await UserRole.create({
      id: uuidv4(),
      userId: newUser.id,
      roleId: role.id,
    }, { transaction });

    await transaction.commit();

    // ❗ Send email after transaction has been successfully committed
    await sendOtpEmail(email, otp);

    return {
      message: 'OTP sent to your email',
    };

  } catch (err) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error('Business Register Error:', err);
    throw new Error(t('auth.internal_error'));
  }
};


const findById = async (id) => {
  const { User, Business } = await getAllModels(process.env.DB_TYPE);

  const user = await User.findByPk(id, {
    attributes: ['id', 'full_name', 'email', 'phone', 'preferred_language', 'is_verified', 'is_active', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Business,
        attributes: ['id'],
        where: { user_id: id },
        required: false,
      },
    ],
  });

  if (!user) {
    throw new Error(t('auth.user_not_found'));
  }

  // Convert to plain object
  const userData = user.toJSON();

  // Extract and remove Businesses, then return the cleaned object
  const businessIds = userData.Businesses?.map((b) => b.id) || [];
  delete userData.Businesses;

  return {
    ...userData,
    business_ids: businessIds,
  };
};

const verifyOtp = async (email, otp, t) => {
  const { User } = await getAllModels(process.env.DB_TYPE);

  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 404, message: t('auth.user_not_found') };

  if (!user.otp || user.otp !== otp) {
    throw { status: 400, message: t('auth.invalid_otp') };
  }

  const now = new Date();
  if (user.otp_expires && new Date(user.otp_expires) < now) {
    throw { status: 400, message: t('auth.otp_expired') };
  }

  user.is_active = true;
  user.is_verified = true;
  user.otp = null;
  user.otp_expires = null;

  await user.save();

  const token = await generateAccessToken({
      phone: user.phone,
      id: user.id,
      slug: user.slug,
      full_name: user.full_name,
      email: user.email,
      preferred_language: user.preferred_language,
      role: user.role,
      isVerified: true,
      // roles: [{ name: roleName }],
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRATION_TIME }
    );

    return {
      user: {
        full_name: user.full_name,
        email: user.email,
        preferred_language: user.preferred_language,
      },
      token,
      refresh_token: refreshToken,
    };
};

const resendOtp = async (email, t) => {
  const { User } = await getAllModels(process.env.DB_TYPE);

  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) throw { status: 404, message: t('auth.user_not_found') };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otp_expires = otpExpires;

  await user.save();

  try {
    await sendOtpEmail(user.email, otp);
  } catch (err) {
    console.error('Failed to send OTP:', err);
    throw { status: 500, message: t('auth.otp_email_failed') };
  }

  return {
    message: t('auth.otp_sent_successfully'),
    email: user.email,
  };
};

const initiatePasswordReset = async (email, t) => {
  const { User } = await getAllModels(process.env.DB_TYPE);

  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) {
    throw { status: 404, message: t('auth.email_not_found') };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otp_expires = otpExpires;

  await user.save();

  try {
    await sendOtpEmail(user.email, otp);
  } catch (err) {
    console.error('Failed to send OTP:', err);
    throw { status: 500, message: t('auth.otp_email_failed') };
  }

  return {
    message: t('auth.otp_sent_successfully'),
    email: user.email,
  };
};

const verifyResetOtp = async (email, otp, t) => {
  const { User } = await getAllModels(process.env.DB_TYPE);

  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 404, message: t('auth.user_not_found') };

  if (!user.otp || user.otp !== otp) {
    throw { status: 400, message: t('auth.invalid_otp') };
  }

  const now = new Date();
  if (user.otp_expires && new Date(user.otp_expires) < now) {
    throw { status: 400, message: t('auth.otp_expired') };
  }

  return {
    message: t('auth.otp_verified'),
    email: user.email,
  };
};

const resetPassword = async (email, otp, newPassword, t) => {
  const { User } = await getAllModels(process.env.DB_TYPE);

  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 404, message: t('auth.user_not_found') };

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear OTP data
  user.password_hash = hashedPassword;
  user.otp = null;
  user.otp_expires = null;

  await user.save();

  return {
    message: t('auth.password_reset_success'),
    email: user.email,
  };
};

const changePassword = async (userId, oldPassword, newPassword, t) => {
  const { User } = await getAllModels(process.env.DB_TYPE);

  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: t('auth.user_not_found') };

  // Verify old password
  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isOldPasswordValid) {
    throw { status: 400, message: t('auth.incorrect_old_password') };
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  user.password_hash = hashedPassword;
  await user.save();

  return {
    message: t('auth.password_changed_success'),
    email: user.email,
  };
};

const refreshToken = async (refreshToken, t) => {
  if (!refreshToken) {
    return {
      status: 400,
      success: false,
      message: t('auth.refresh_token_required'),
    };
  }

  try {
    // 1. Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const userId = decoded.id;

    const { User } = await getAllModels(process.env.DB_TYPE);
    const user = await User.findByPk(userId);

    if (!user) {
      return {
        status: 404,
        success: false,
        message: t('auth.user_not_found'),
      };
    }

    // 2. Issue new tokens
    const newAccessToken = jwt.sign({ id: user.id, slug: user.slug }, JWT_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRATION_TIME || '1d',
    });

    const newRefreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRATION_TIME || '7d',
    });

    return {
      status: 200,
      success: true,
      data: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      },
    };
  } catch (err) {
    console.error(t('auth.refresh_token_invalid'), err);
    return {
      status: 401,
      success: false,
      message: t('auth.refresh_token_invalid'),
    };
  }
};

const 

getUserBusinessSummary = async (userId) => {
  const {
    Business,
    BusinessCategory,
    Category,
    BusinessService,
    BusinessServiceDetail,
    Location,
  } = await getAllModels(process.env.DB_TYPE);

  // 1. Get all businesses by user
  const businesses = await Business.findAll({
    where: { user_id: userId },
    attributes: ['id', 'name'],
    raw: true,
  });
  
  if (!businesses.length) {
    return {
      status: 404,
      success: false,
      message: 'No businesses found for this user',
    };
  }

  const businessIds = businesses.map(b => b.id);

  // 2. Get all related categories
  const businessCategories = await BusinessCategory.findAll({
    where: { business_id: businessIds },
    include: [{
      model: Category,
      as: 'category',
      attributes: ['id', 'name', 'is_class'],
    }],
  });  

  const categories = businessCategories
    .map(bc => bc.category)
    .filter(Boolean)
    .reduce((acc, c) => {
      if (!acc.find(existing => existing.id === c.id)) acc.push(c);
      return acc;
    }, []);
    
  // 3. Get all services
  const services = await BusinessService.findAll({
    where: { business_id: businessIds },
    include: [{
      model: BusinessServiceDetail,
      as: 'service_details',
      attributes: ['id', 'name'],
    }],
  });

  const flatServices = services.flatMap(s => s.service_details || []);
  const uniqueServices = flatServices.reduce((acc, s) => {
    if (!acc.find(existing => existing.id === s.id)) acc.push(s);
    return acc;
  }, []);

  // 4. Get all locations
  const locations = await Location.findAll({
    where: { business_id: businessIds },
    attributes: ['id', 'title'],
    raw: true,
  });

  return {
    status: 200,
    success: true,
    data: {
      businesses,
      categories,
      services: uniqueServices,
      locations,
    },
  };
};

const updateUserProfile = async (userId, payload) => {
  const { User } = await getAllModels(process.env.DB_TYPE);

  const user = await User.findByPk(userId);
  if (!user) {
    return { status: 404, success: false, message: 'User not found' };
  }

  const updates = {};
  if (payload.full_name) updates.full_name = payload.full_name;
  if (payload.phone) updates.phone = payload.phone;

  await user.update(updates);

  return {
    status: 200,
    success: true,
    message: 'User updated successfully',
    data: {
      id: user.id,
      full_name: user.full_name,
      phone: user.phone,
    },
  };
};

const handleSocialLogin = async (payload, t) => {
  const { email, provider, name } = payload;

  const { User, Role, UserRole, sequelize } = await getAllModels(process.env.DB_TYPE);
  const transaction = await sequelize.transaction();

  try {
    let existingUser = await User.findOne({ where: { email } });

    // 🔒 CASE 1: Email exists with different provider
    if (existingUser && existingUser.oauth_provider !== provider) {
      if (!existingUser.oauth_provider) {
        throw new Error(t('auth.email_exists_password_user')); // "Email registered with password. Login manually."
      } else {
        throw new Error(
          t('auth.social_login_with_different_provider', {
            provider: existingUser.oauth_provider,
          })
        ); // "Email already registered via Google. Login with Google."
      }
    }

    // 🔄 CASE 2: Create new user if not exists
    if (!existingUser) {
      const slugifyBase = (str) =>
        str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

      const generateUniqueSlug = async (Model, baseName) => {
        const baseSlug = slugifyBase(baseName);
        let attempt = 0;
        let finalSlug;

        while (attempt < 5) {
          const suffix = attempt === 0 ? '' : `-${Math.floor(1000 + Math.random() * 9000)}`;
          finalSlug = `${baseSlug}${suffix}`;
          const exists = await Model.findOne({ where: { slug: finalSlug } });
          if (!exists) return finalSlug;
          attempt++;
        }

        throw new Error(t('auth.unable_to_generate_unique_slug'));
      };

      const slug = await generateUniqueSlug(User, name);
      const role = await Role.findOne({ where: { name: 'user' } });
      if (!role) throw new Error(t('auth.invalid_role'));

      let userCreated = false;
      let retryCount = 0;

      while (!userCreated && retryCount < 3) {
        try {
          existingUser = await User.create(
            {
              id: uuidv4(),
              full_name: name,
              email,
              slug,
              oauth_provider: provider,
              oauth_uid: `${provider}-${email}`,
              is_verified: true,
              is_active: true,
              role: role.name,
            },
            { transaction }
          );

          await UserRole.create(
            {
              id: uuidv4(),
              userId: existingUser.id,
              roleId: role.id,
            },
            { transaction }
          );

          userCreated = true;
          await transaction.commit();
        } catch (error) {
          if (
            error.name === 'SequelizeUniqueConstraintError' &&
            error.fields?.slug
          ) {
            retryCount++;
            console.warn(`Slug conflict for ${slug}. Retrying...`);
            continue;
          } else {
            throw error;
          }
        }
      }

      if (!userCreated) {
        throw new Error(t('auth.unable_to_create_user'));
      }
    }

    // ✅ CASE 3: Generate JWT tokens for valid user
    const accessToken = jwt.sign(
      { id: existingUser.id, slug: existingUser.slug },
      JWT_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRATION_TIME || '1d' }
    );

    const refreshToken = jwt.sign(
      { id: existingUser.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRATION_TIME || '7d' }
    );

    return {
      success: true,
      message: t('auth.login_success'),
      data: {
        user: {
          id: existingUser.id,
          name: existingUser.full_name,
          email: existingUser.email,
          slug: existingUser.slug,
          is_verified: existingUser.is_verified,
          is_active: existingUser.is_active,
          preferred_language: existingUser.preferred_language || 'en-us',
        },
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    console.error('Social login failed:', error);
    throw new Error(t && typeof t === 'function' ? error.message : 'Internal server error');
  }
};

module.exports = {
  updateUserById,
  deleteUser,
  findUser,
  getAllUsers,
  register,
  login,
  businessRegister,
  findById,
  verifyOtp,
  resendOtp,
  refreshToken,
  getUserBusinessSummary,
  updateUserProfile,
  handleSocialLogin,
  initiatePasswordReset,
  verifyResetOtp,
  resetPassword,
  changePassword
};
