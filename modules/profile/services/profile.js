const { Op, Sequelize, where, literal } = require("sequelize");
const { getAllModels } = require("../../../middlewares/loadModels");

exports.createStaffProfile = async (data) => {
  const { StaffProfile, Category, StaffCategory } = await getAllModels(process.env.DB_TYPE);
  const resultProfiles = [];

  for (const staff of data) {
    const categoryIds = Array.isArray(staff.category_id) ? staff.category_id : [staff.category_id];

    // remove category_id from StaffProfile table payload
    const { category_id, ...staffPayload } = staff;

    // Always use the first category's is_class (optional logic — adjust if needed)
    const firstCategory = await Category.findByPk(categoryIds[0]);
    staffPayload.for_class = firstCategory?.is_class ?? false;

    const [profile] = await StaffProfile.upsert(staffPayload, { returning: true });

    // Clear existing category mappings (optional: for update scenarios)
    await StaffCategory.destroy({ where: { staff_profile_id: profile.id } });

    // Create new category mappings
    for (const categoryId of categoryIds) {
      await StaffCategory.create({
        staff_profile_id: profile.id,
        category_id: categoryId,
      });
    }

    resultProfiles.push(profile);
  }

  return resultProfiles;
};

exports.getStaffProfileById = async (id) => {
  const { StaffProfile } = await getAllModels(process.env.DB_TYPE);
  return await StaffProfile.findByPk(id);
};

exports.getWholeStaff = async (query) => {
  const { StaffProfile } = await getAllModels(process.env.DB_TYPE);

  const {
    business_id,
    category_id,
    location_id,
    email,
    name,
    limit = 10,
    offset = 0,
  } = query;
  const where = {};
  if (business_id) where.business_id = business_id;
  if (category_id) where.category_id = category_id;
  if (location_id) where.location_id = location_id;
  if (email) where.email = email;
  if (name) where.name = { [Op.iLike]: `%${name}%` };

  return await StaffProfile.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
};

exports.getWholeStaffByBusinessServiceDetail = async (query) => {
  const { 
    StaffService,
    StaffProfile,
    BusinessServiceDetail,
    Category,
    BusinessService
  } = await getAllModels(process.env.DB_TYPE);

  const location_id = query.location_id;

  const rawData = await StaffService.findAll({
    attributes: ["id", "service_id"],
    include: [
      {
        model: StaffProfile,
        as: 'staff_profile_details',
        where: {
          location_id: {
            [Op.contains]: [location_id],
          },
        },
        attributes: ["id", "name"],
      },
      {
        model: BusinessServiceDetail,
        as: 'service_details',
        attributes: ["id", "name","description"],
        include: [
          {
            model: BusinessService,
            as: 'business_service',
            attributes: ["id", "category_id", "is_class"],
            include:{
              model: Category,
              as: 'category',
              attributes: ["id","name", "slug", "description", "level", "is_class"]
            }
          }
        ]
      }
    ],
    order: [["createdAt", "DESC"]],
  });

  // Transform to grouped format
  const serviceMap = {};

  for (const item of rawData) {
    const service = item.service_details;
    const staff = item.staff_profile_details;

    if (!service || !staff) continue;

    if (!serviceMap[service.id]) {
      serviceMap[service.id] = {
        service_id: service.id,
        service_name: service.name,
        category: service.category,
        staff_members: [],
      };
    }

    serviceMap[service.id].staff_members.push({
      id: staff.id,
      name: staff.name,
    });
  }

  // Convert to array
  const result = Object.values(serviceMap);
  return result;
};



exports.getStaffProfilesByUserId = async (id, query) => {
  const { StaffProfile } = await getAllModels(process.env.DB_TYPE);
  const { name, limit = 10, offset = 0 } = query;

  const where = { user_id: id };
  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  return await StaffProfile.findAll({
    where,
    attributes: [
      "id",
      "profile_photo_url",
      "name",
      "email",
      "is_available",
    ],
    limit,
    offset,
  });
};

exports.getStaffProfilesByBusinessId = async (businessId) => {
  const { StaffProfile, Category } = await getAllModels(process.env.DB_TYPE);

  return await StaffProfile.findAll({
    where: {
      business_id: businessId
      // Removed is_available filter to get ALL staff profiles
    },
    attributes: [
      "id",
      "user_id",
      "business_id",
      "profile_photo_url",
      "name",
      "email",
      "phone_number",
      "gender",
      "for_class",
      "is_available",
      "location_id",
      "createdAt",
      "updatedAt"
    ],
    include: [
      {
        model: Category,
        as: 'categories',
        attributes: ['id', 'name', 'slug', 'description', 'is_class'],
        through: { attributes: [] } // Don't include junction table attributes
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

exports.getStaffProfilesByLocationsId = async (locationId) => {
  const { StaffProfile, StaffSchedule } = await getAllModels(process.env.DB_TYPE);


  const StaffProfiles = await StaffProfile.findAll({
  where: {
    location_id: {
      [Op.contains]: [locationId]
    }
  }
});

for (const profile of StaffProfiles) {
  const schedules = await StaffSchedule.findAll({
    where: {
      staff_profile_id: profile.id,
      location_id: {
        [Op.in]: profile.location_id,
      },
    },
  });
  
  profile.setDataValue("location_schedules", schedules);
}
  return StaffProfiles;

};

exports.getStaffProfilesByServiceSchedules = async (location_id) => {
  const { StaffService, StaffProfile, BusinessServiceDetail, BusinessService } = await getAllModels(
    process.env.DB_TYPE
  );

  // Step 1: Get all staff IDs for this location
  const staffProfiles = await StaffProfile.findAll({
    where: {
      location_id: {
        [Op.contains]: [location_id],
      },
    },
    attributes: ["id"],
    // raw: true,
  });

  const staffIds = staffProfiles.map((sp) => sp.id);

  if (!staffIds.length) {
    return {
      statusCode: 200,
      status: true,
      message: "staff_schedule.found",
      data: {
        schedule: [],
      },
    };
  }

  // Step 2: Get StaffServices with Services + Categories
  const staffServices = await StaffService.findAll({
    where: {
      staff_profile_id: {
        [Op.in]: staffIds,
      },
    },
    attributes: ["id", "staff_profile_id", "service_id", "is_class"],
    include: [
      {
        model: BusinessServiceDetail,
        as: "service_details",
        attributes: ["id", "name", "description", "service_id"],
        include: [
          {
            model: BusinessService,
            as: "business_service",
            attributes: ["id", "is_class", "is_class"],
          },
        ],
      },
    ],
    raw: true,
    // nest: true,
  });

  return staffServices;
};

exports.getStaffSchedule = async (id) => {
  const {
    Category,
    Location,
    StaffService,
    StaffProfile,
    StaffSchedule,
    BusinessServiceDetail,
    BusinessService,
  } = await getAllModels(process.env.DB_TYPE);

  const profile = await StaffProfile.findByPk(id);
  if (!profile) {
    return { status: 404, success: false, message: "Staff member not found" };
  }

  const selectedServiceIds = await StaffService.findAll({
    where: { staff_profile_id: id },
    attributes: ["service_id"],
    raw: true,
  }).then((results) => results.map((r) => r.service_id));

  let services = [];
  if (profile.business_id) {
    const serviceDetails = await BusinessServiceDetail.findAll({
      where: { business_id: profile.business_id },
      attributes: ["id", "name"],
      include: [
        {
          model: BusinessService,
          as: "business_service",
          required: true,
          attributes: ["is_class"],
          include: [
            {
              model: Category,
              as: "category",
              required: true,
              attributes: ["level", "slug"],
            },
          ],
        },
      ],
      raw: false,
    });

    services = serviceDetails.map((detail) => {
      const bs = detail.business_service;
      const category = bs?.category;

      return {
        id: detail.id,
        name: detail.name,
        is_selected: selectedServiceIds.includes(detail.id),
        is_class: bs?.is_class ?? null,
        level: category?.level ?? null,
        slug: category?.slug ?? null,
      };
    });
  }

  const staffSchedules = await StaffSchedule.findAll({
    where: { staff_profile_id: id },
    raw: true,
  });

  let locations = [];
  if (Array.isArray(profile.location_id) && profile.location_id.length > 0) {
    const allLocations = await Location.findAll({
      where: { id: profile.location_id },
      attributes: ["id", "title"],
    });

    locations = allLocations.map((loc) => {
      const locationSchedules = staffSchedules.filter(
        (s) => s.location_id === loc.id
      );

      const days_schedule = locationSchedules.map((s) => ({
        day: s.day,
        from: s.from,
        to: s.to,
        is_selected: true,
      }));

      return {
        ...loc.toJSON(),
        is_selected: days_schedule.length > 0,
        days_schedule,
      };
    });
  }

  return {
    statusCode: 200,
    status: true,
    message: "staff_schedule.found",
    data: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone_number: profile.phone_number,
      is_available: profile.is_available,
      business_id: profile.business_id,
      category: services, // replaces old 'category' key
      locations,
    },
  };
};



exports.createStaffSchedule = async (id, data) => {
  const {
    StaffProfile,
    StaffService,
    StaffSchedule,
    StaffLocation,
    BusinessService,
    BusinessServiceDetail,
  } = await getAllModels(process.env.DB_TYPE);

  const staffProfile = await StaffProfile.findByPk(id);
  if (!staffProfile) {
    return { status: 404, success: false, message: "Staff member not found" };
  }


  

  const { locations = [] } = data;

  await StaffService.destroy({ where: { staff_profile_id: id } });
  await StaffLocation.destroy({ where: { staff_profile_id: id } });
  await StaffSchedule.destroy({ where: { staff_profile_id: id } });

  const allServices = [];
  const allSchedules = [];
  const allLocations = [];

  for (const loc of locations) {
    const location_id = loc.id;
    const services = loc.services || [];
    const schedules = loc.days_schedule || [];

    if (!location_id) {
      console.warn(`Skipping location without ID`);
      continue;
    }

    allLocations.push({
      staff_profile_id: id,
      location_id,
    });

    if (services.length > 0) {
      const serviceEntities = await BusinessServiceDetail.findAll({
        where: {
          id: {
            [Op.in]: services,
          },
        },
        attributes: ["id"],
        include: [
          {
            model: BusinessService,
            as: "business_service",
            attributes: ["is_class"],
          },
        ],
      });

      const serviceMap = new Map();
      serviceEntities.forEach((s) => {
        serviceMap.set(s.id, s);
      });

      services.forEach((serviceId) => {
        const service = serviceMap.get(serviceId);
        if (service) {
          allServices.push({
            staff_profile_id: id,
            service_id: serviceId,
            is_class: service.business_service?.is_class || false,
          });
        }
      });
    }

    schedules.forEach((schedule) => {

      if (schedule.day && schedule.from && schedule.to) {
        allSchedules.push({
          staff_profile_id: id,
          location_id,
          day: schedule.day.toLowerCase(),
          from: schedule.from,
          to: schedule.to,
        });
      } else {
        console.warn("Invalid schedule data:", schedule);
      }
    });
  }

  const promises = [];

  if (allServices.length > 0) {
    promises.push(StaffService.bulkCreate(allServices));
  }

  if (allLocations.length > 0) {
    promises.push(StaffLocation.bulkCreate(allLocations));
  }

  if (allSchedules.length > 0) {
    promises.push(StaffSchedule.bulkCreate(allSchedules));
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }

  return {
    status: 200,
    success: true,
    message: "Staff schedule created successfully",
    data: {
      services_created: allServices.length,
      locations_created: allLocations.length,
      schedules_created: allSchedules.length,
    },
  };
};

exports.updateStaffProfile = async (id, data) => {
  const { StaffProfile } = await getAllModels(process.env.DB_TYPE);
  return await StaffProfile.update(data, { where: { id } });
};

exports.deleteStaffProfile = async (id) => {
  const { StaffProfile } = await getAllModels(process.env.DB_TYPE);
  return await StaffProfile.destroy({ where: { id } });
};


const slugifyBase = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')   
      .replace(/[^a-z0-9\-]/g, '');


  const generateUniqueSlug = async (Model, baseName, attempt = 0) => {
    const baseSlug = slugifyBase(baseName);
    const suffix = `-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalSlug = `${baseSlug}${attempt === 0 ? '' : suffix}`;

    const exists = await Model.findOne({ where: { slug: finalSlug } });
    if (exists) return generateUniqueSlug(Model, baseName, attempt + 1);
    return finalSlug;
  };


exports.createClientProfile = async (data) => {
  const { User } = await getAllModels(process.env.DB_TYPE);
  const slug = await generateUniqueSlug(User, data.full_name);

  const emailUser = await User.findOne({ where: { email: data.email } });
  if (emailUser) {
    return {
      profile: null,
      error: {
        type: "email_conflict",
        message: `It looks like the email already exists for ${emailUser.full_name}`
      }
    };
  }

  const phoneUser = await User.findOne({ where: { phone: data.phone } });
  if (phoneUser) {
    return {
      profile: null,
      error: {
        type: "phone_conflict",
        message: `It looks like the phone number already exists for ${phoneUser.full_name}`
      }
    };
  }

  data = { ...data, slug };
  const user = await User.create(data);

  return {
    profile: user,
    error: null
  };
};


exports.getClientProfileById = async (id) => {
  const { User } = await getAllModels(process.env.DB_TYPE);
  return await User.findByPk(id);
};

exports.listAllClientProfiles = async (query) => {
  const { User } = await getAllModels(process.env.DB_TYPE);

  const { email, full_name, phone, limit = 10, offset = 0 } = query;
  const where = {};
  if (email) where.email = email;
  if (full_name) where.full_name = { [Op.iLike]: `%${full_name}%` };
  if (phone) where.phone = { [Op.iLike]: `%${phone}%` };

  return await User.findAll({
    where,
    limit,
    offset,
    attributes: ['id','full_name','email','phone','is_verified'],
    order: [["createdAt", "DESC"]],
  });
};

exports.updateClientProfile = async (id, data) => {
  const { User } = await getAllModels(process.env.DB_TYPE);
  return await User.update(data, { where: { id } });
};

exports.deleteClientProfile = async (id) => {
  const { User } = await getAllModels(process.env.DB_TYPE);
  return await User.destroy({ where: { id } });
};

exports.createClientPreference = async (data) => {
  const { ClientPreference } = await getAllModels(process.env.DB_TYPE);
  return await ClientPreference.create(data);
};

exports.getClientPreferenceByUserId = async (user_id) => {
  const { ClientPreference } = await getAllModels(process.env.DB_TYPE);
  return await ClientPreference.findOne({ where: { user_id } });
};

exports.updateClientPreference = async (user_id, data) => {
  const { ClientPreference } = await getAllModels(process.env.DB_TYPE);
  return await ClientPreference.update(data, { where: { user_id } });
};

exports.deleteClientPreference = async (user_id) => {
  const { ClientPreference } = await getAllModels(process.env.DB_TYPE);
  return await ClientPreference.destroy({ where: { user_id } });
};

exports.getStaffByCategoryLevel0 = async (businessId) => {
  const { StaffProfile, Category } = await getAllModels(process.env.DB_TYPE);

  try {
    // Get all staff profiles for the business with their categories
    const staffProfiles = await StaffProfile.findAll({
      where: {
        business_id: businessId
        // Removed is_available filter to get ALL staff profiles
      },
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'slug', 'description', 'level', 'is_class', 'is_active'],
          include: [
            {
              model: Category,
              as: 'parent',
              attributes: ['id', 'name', 'slug', 'description', 'level', 'is_class', 'is_active'],
              required: false
            }
          ],
          through: { attributes: [] } // Don't include the junction table attributes
        }
      ],
      attributes: [
        'id', 'user_id', 'business_id', 'profile_photo_url', 'name', 'email',
        'phone_number', 'gender', 'for_class', 'is_available', 'location_id',
        'createdAt', 'updatedAt'
      ],
      order: [['createdAt', 'DESC']]
    });

    // Group staff by level 0 categories
    const staffByCategory = {};
    const processedStaffIds = new Set();

    for (const staff of staffProfiles) {
      if (processedStaffIds.has(staff.id)) continue;

      const staffData = {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        phone_number: staff.phone_number,
        profile_photo_url: staff.profile_photo_url,
        gender: staff.gender,
        for_class: staff.for_class,
        is_available: staff.is_available,
        location_id: staff.location_id,
        created_at: staff.createdAt,
        updated_at: staff.updatedAt
      };

      // Find level 0 category for this staff
      let level0Category = null;
      
      for (const category of staff.categories) {
        // If category is level 0, use it directly
        if (category.level === 0) {
          level0Category = category;
          break;
        }
        // If category has a parent and parent is level 0, use the parent
        else if (category.parent && category.parent.level === 0) {
          level0Category = category.parent;
          break;
        }
        // If category has a parent but parent is not level 0, find the root parent
        else if (category.parent) {
          // Find the root parent (level 0) by traversing up
          let currentParent = category.parent;
          while (currentParent && currentParent.level !== 0) {
            const parentCategory = await Category.findByPk(currentParent.parent_id, {
              include: [{
                model: Category,
                as: 'parent',
                attributes: ['id', 'name', 'slug', 'description', 'level', 'is_class', 'is_active'],
                required: false
              }]
            });
            if (parentCategory && parentCategory.level === 0) {
              level0Category = parentCategory;
              break;
            }
            currentParent = parentCategory?.parent;
          }
          if (level0Category) break;
        }
      }

      // If no level 0 category found, use "Uncategorized"
      const categoryName = level0Category ? level0Category.name : 'Uncategorized';
      
      if (!staffByCategory[categoryName]) {
        staffByCategory[categoryName] = {
          category_name: categoryName,
          category_id: level0Category ? level0Category.id : null,
          staff_members: []
        };
      }

      staffByCategory[categoryName].staff_members.push(staffData);
      processedStaffIds.add(staff.id);
    }

    // Convert to array format
    const result = Object.values(staffByCategory);

    return {
      business_id: businessId,
      total_categories: result.length,
      total_staff: staffProfiles.length,
      categories: result
    };
  } catch (error) {
    console.error('Error in getStaffByCategoryLevel0:', error);
    throw error;
  }
};

exports.createOrUpdateStaffWithSchedule = async (data) => {
  const { StaffProfile, Category, StaffCategory, StaffService, StaffLocation, StaffSchedule, sequelize } = await getAllModels(process.env.DB_TYPE);
  
  const transaction = await sequelize.transaction();
  
  try {
    const isUpdate = !!data.id;
    let staffProfile;
    
    // Prepare staff profile data
    const { category_id, schedules, ...staffPayload } = data;
    
    if (isUpdate) {
      // Update existing staff profile
      await StaffProfile.update(staffPayload, { 
        where: { id: data.id },
        transaction 
      });
      staffProfile = await StaffProfile.findByPk(data.id, { transaction });
    } else {
      // Create new staff profile
      staffProfile = await StaffProfile.create(staffPayload, { transaction });
    }
    
    // Handle categories
    if (category_id && category_id.length > 0) {
      // Filter out empty strings and invalid UUIDs
      const validCategoryIds = category_id.filter(catId => 
        catId && catId !== '' && catId !== 'null' && catId !== 'undefined'
      );
      
      if (validCategoryIds.length > 0) {
        // Clear existing categories
        await StaffCategory.destroy({ 
          where: { staff_profile_id: staffProfile.id },
          transaction 
        });
        
        // Create new category mappings
        const categoryMappings = validCategoryIds.map(catId => ({
          staff_profile_id: staffProfile.id,
          category_id: catId,
        }));
        await StaffCategory.bulkCreate(categoryMappings, { transaction });
      }
    }
    

    
    // Handle schedules if provided
    if (schedules && schedules.locations && schedules.locations.length > 0) {      
      // Clear existing schedules, services, and locations
      await StaffService.destroy({ 
        where: { staff_profile_id: staffProfile.id },
        transaction 
      });
      await StaffLocation.destroy({ 
        where: { staff_profile_id: staffProfile.id },
        transaction 
      });
      await StaffSchedule.destroy({ 
        where: { staff_profile_id: staffProfile.id },
        transaction 
      });
      
      const allServices = [];
      const allSchedules = [];
      const allLocations = [];
      
      for (const location of schedules.locations) {
        const location_id = location.id;
        const services = location.services || [];
        const locationSchedules = location.days_schedule || [];
        
        if (!location_id) {
          continue;
        }
        
        // Add location mapping
        allLocations.push({
          staff_profile_id: staffProfile.id,
          location_id,
        });
        
        // Add services
        services.forEach(serviceId => {
          allServices.push({
            staff_profile_id: staffProfile.id,
            service_id: serviceId,
            is_class: false, // Default value
          });
        });
        
        // Add schedules
        locationSchedules.forEach(schedule => {
          if (schedule.day && schedule.from && schedule.to) {
            allSchedules.push({
              staff_profile_id: staffProfile.id,
              location_id,
              day: schedule.day.toLowerCase(),
              from: schedule.from,
              to: schedule.to,
            });
          }
        });
      }
      
      // Bulk create all relationships
      if (allServices.length > 0) {
        await StaffService.bulkCreate(allServices, { transaction });
      }
      if (allLocations.length > 0) {
        await StaffLocation.bulkCreate(allLocations, { transaction });
      }
      if (allSchedules.length > 0) {
        await StaffSchedule.bulkCreate(allSchedules, { transaction });
      }
      
      // Update StaffProfile with location_ids from schedules
      if (locationIdsForProfile.length > 0) {
        const locationArrayLiteral = `ARRAY[${locationIdsForProfile.map(id => `'${id}'::uuid`).join(', ')}]`;
        await StaffProfile.update(
          { location_id: literal(locationArrayLiteral) },
          { 
            where: { id: staffProfile.id },
            transaction 
          }
        );
      }
    }
    
    await transaction.commit();
    
    // Get the complete staff profile with relationships
    const completeProfile = await StaffProfile.findByPk(staffProfile.id, {
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'slug', 'description', 'is_class'],
          through: { attributes: [] }
        }
      ]
    });
  
    return {
      statusCode: isUpdate ? 200 : 201,
      message: isUpdate ? 'staff.updated' : 'staff.created',
      data: {
        staff: completeProfile,
        schedules_created: schedules ? true : false
      }
    };
    
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.unifiedStaffWithSchedule = async (data) => {
  
  const { StaffProfile, Category, StaffCategory, StaffService, StaffLocation, StaffSchedule, sequelize } = await getAllModels(process.env.DB_TYPE);
  
  const transaction = await sequelize.transaction();
  
  try {
    const isUpdate = !!data.id;
    let staffProfile;
    
    // Prepare staff profile data
    const { category_id, schedules, ...staffPayload } = data;

    
    // Clean the payload - convert empty strings to null for UUID fields
    const cleanedPayload = {};
    for (const [key, value] of Object.entries(staffPayload)) {
      // Skip id field if it's null, empty, or undefined (for create operations)
      if (key === 'id' && (value === null || value === '' || value === 'null' || value === 'undefined' || value === undefined)) {
        continue;
      }
      
      if (value === '' || value === 'null' || value === 'undefined') {
        cleanedPayload[key] = null;
      } else {
        cleanedPayload[key] = value;
      }
    }
    
    if (isUpdate) {
      // Update existing staff profile
      await StaffProfile.update(cleanedPayload, { 
        where: { id: data.id },
        transaction 
      });
      staffProfile = await StaffProfile.findByPk(data.id, { transaction });
    } else {
      // Create new staff profile
      staffProfile = await StaffProfile.create(cleanedPayload, { transaction });      
    }
    
    // Handle categories
    if (category_id && category_id.length > 0) {
      // Filter out empty strings and invalid UUIDs
      const validCategoryIds = category_id.filter(catId => 
        catId && catId !== '' && catId !== 'null' && catId !== 'undefined'
      );
      
      if (validCategoryIds.length > 0) {
        // Validate that categories exist in the database
        const existingCategories = await Category.findAll({
          where: { id: validCategoryIds },
          attributes: ['id', 'name'],
          transaction
        });
        
        const existingCategoryIds = existingCategories.map(cat => cat.id);
        const missingCategoryIds = validCategoryIds.filter(id => !existingCategoryIds.includes(id));
        
        if (missingCategoryIds.length > 0) {
          console.error('❌ [UNIFIED STAFF] Missing categories:', missingCategoryIds);
          
          // Get available categories for better error message
          const availableCategories = await Category.findAll({
            attributes: ['id', 'name'],
            limit: 10,
            transaction
          });
          
          const availableCategoryList = availableCategories.map(cat => `${cat.name} (${cat.id})`).join(', ');
          
          throw new Error(`Categories not found: ${missingCategoryIds.join(', ')}. Please use valid category IDs. Available categories: ${availableCategoryList}`);
        }
        // Clear existing categories
        await StaffCategory.destroy({ 
          where: { staff_profile_id: staffProfile.id },
          transaction 
        });
        
        // Create new category mappings
        const categoryMappings = validCategoryIds.map(catId => ({
          staff_profile_id: staffProfile.id,
          category_id: catId,
        }));
        await StaffCategory.bulkCreate(categoryMappings, { transaction });
      } 
    }
    
    // Handle schedules if provided
    if (schedules && schedules.locations && schedules.locations.length > 0) {
      await StaffService.destroy({ 
        where: { staff_profile_id: staffProfile.id },
        transaction 
      });
      await StaffLocation.destroy({ 
        where: { staff_profile_id: staffProfile.id },
        transaction 
      });
      await StaffSchedule.destroy({ 
        where: { staff_profile_id: staffProfile.id },
        transaction 
      });
      
      const allServices = [];
      const allSchedules = [];
      const allLocations = [];
      const locationIdsForProfile = []; // Array to collect location IDs for StaffProfile
      
      for (const [locationIndex, location] of schedules.locations.entries()) {
        
        // Handle location ID - could be string or object
        let location_id;
        if (typeof location.id === 'object' && location.id.id) {
          location_id = location.id.id;
        } else if (typeof location.id === 'string') {
          // Try to parse malformed location ID strings
          const locationString = location.id;
          
          // Check if it's a malformed object string like "{id: uuid, name: name}"
          const uuidMatch = locationString.match(/id:\s*([a-f0-9-]{36})/i);
          if (uuidMatch) {
            location_id = uuidMatch[1];
          } else {
            // Check if it's a valid UUID
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (uuidRegex.test(locationString)) {
              location_id = locationString;
            } else {
              continue;
            }
          }
        } else {
          console.warn(`⚠️ [UNIFIED STAFF] Skipping location without valid ID:`, location);
          continue;
        }
        
        const services = location.services || [];
        const locationSchedules = location.days_schedule || [];
        
        
        // Add location ID to array for StaffProfile
        locationIdsForProfile.push(location_id);
        
        // Add location mapping
        allLocations.push({
          staff_profile_id: staffProfile.id,
          location_id,
        });
        
        // Add services - handle both UUID and string service IDs
        services.forEach((serviceId, serviceIndex) => {
          // Check if serviceId is a valid UUID format
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          
          if (uuidRegex.test(serviceId)) {
            // Valid UUID format - add to validation list
            allServices.push({
              staff_profile_id: staffProfile.id,
              service_id: serviceId,
              is_class: false, // Default value
            });
          } else {
            // Non-UUID format - skip for now or handle differently
            console.warn(`⚠️ [UNIFIED STAFF] Skipping non-UUID service ID: ${serviceId}`);
            // You could implement a service name to UUID mapping here
          }
        });
        
        // Add schedules
        locationSchedules.forEach((schedule, scheduleIndex) => {
          if (schedule.day && schedule.from && schedule.to) {
            // Normalize day to lowercase
            const normalizedDay = schedule.day.toLowerCase();
            
            // Validate day format
            const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            if (!validDays.includes(normalizedDay)) {
              console.warn(`⚠️ [UNIFIED STAFF] Invalid day format: ${schedule.day}, skipping schedule`);
              return;
            }
            
            allSchedules.push({
              staff_profile_id: staffProfile.id,
              location_id,
              day: normalizedDay,
              from: schedule.from,
              to: schedule.to,
            });
          } else {
            console.warn("⚠️ [UNIFIED STAFF] Invalid schedule data:", schedule);
          }
        });
      }
      
      
      // Bulk create all relationships
      if (allServices.length > 0) {
        const { BusinessServiceDetail, BusinessService } = await getAllModels(process.env.DB_TYPE);
        
        const serviceIds = allServices.map(service => service.service_id);
        
        // First, try to find in BusinessServiceDetails
        const existingServiceDetails = await BusinessServiceDetail.findAll({
          where: { id: serviceIds },
          attributes: ['id'],
          transaction
        });
        
        // Then, try to find in BusinessServices
        const existingBusinessServices = await BusinessService.findAll({
          where: { id: serviceIds },
          attributes: ['id'],
          transaction
        });
        
        const existingServiceDetailIds = existingServiceDetails.map(service => service.id);
        const existingBusinessServiceIds = existingBusinessServices.map(service => service.id);
        const allExistingIds = [...existingServiceDetailIds, ...existingBusinessServiceIds];
        
        const missingServiceIds = serviceIds.filter(id => !allExistingIds.includes(id));
        
        if (missingServiceIds.length > 0) {
          console.error('❌ [UNIFIED STAFF] Missing services:', missingServiceIds);
          
          // Get available services for better error message
          const availableServiceDetails = await BusinessServiceDetail.findAll({
            where: { business_id: staffPayload.business_id },
            attributes: ['id', 'name'],
            limit: 10,
            transaction
          });
          
          const availableBusinessServices = await BusinessService.findAll({
            where: { business_id: staffPayload.business_id },
            attributes: ['id'],
            include: [{
              model: Category,
              as: 'category',
              attributes: ['name']
            }],
            limit: 10,
            transaction
          });
          
          const availableServiceList = [
            ...availableServiceDetails.map(service => `${service.name} (${service.id})`),
            ...availableBusinessServices.map(service => `${service.category?.name || 'Unknown'} (${service.id})`)
          ].join(', ');
          
          throw new Error(`Services not found: ${missingServiceIds.join(', ')}. Please use valid service IDs from BusinessServiceDetails or BusinessServices. Available services for this business: ${availableServiceList}`);
        }
                
        // Handle BusinessServices IDs by creating BusinessServiceDetails records
        for (const service of allServices) {
          // Check if this is a BusinessServices ID
          const isBusinessServiceId = existingBusinessServiceIds.includes(service.service_id);
          
          if (isBusinessServiceId) {
            // Find the BusinessService to get category info
            const businessService = existingBusinessServices.find(bs => bs.id === service.service_id);
            if (businessService) {
              // Create a BusinessServiceDetails record
              const businessServiceDetail = await BusinessServiceDetail.create({
                business_id: staffPayload.business_id,
                service_id: service.service_id,
                name: `Staff Service - ${businessService.category?.name || 'Unknown'}`,
                description: `Auto-generated for staff service`
              }, { transaction });
              
              // Update the service_id to use the new BusinessServiceDetails ID
              service.service_id = businessServiceDetail.id;
            }
          }
        }
        
        await StaffService.bulkCreate(allServices, { transaction });
      }
      if (allLocations.length > 0) {
        await StaffLocation.bulkCreate(allLocations, { transaction });
      }
      if (allSchedules.length > 0) {
        await StaffSchedule.bulkCreate(allSchedules, { transaction });
      }
    }
    await transaction.commit();
    // Get the complete staff profile with relationships
    const completeProfile = await StaffProfile.findByPk(staffProfile.id, {
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'slug', 'description', 'is_class'],
          through: { attributes: [] }
        }
      ]
    });
    
    const result = {
      statusCode: isUpdate ? 200 : 201,
      message: isUpdate ? 'staff.updated' : 'staff.created',
      data: {
        staff: completeProfile,
        schedules_created: schedules ? true : false
      }
    };
        
    return result;
    
  } catch (error) {
    console.error('❌ [UNIFIED STAFF] Error occurred:', error.message);
    console.error('❌ [UNIFIED STAFF] Error stack:', error.stack);
    await transaction.rollback();
    throw error;
  }
};

exports.getStaffWithComprehensiveData = async (businessId, staffId = null) => {
  const { 
    StaffProfile, 
    Category, 
    StaffCategory,
    StaffService,
    StaffLocation,
    StaffSchedule,
    BusinessServiceDetail,
    Location
  } = await getAllModels(process.env.DB_TYPE);

  try {
    // Build where clause
    const whereClause = { business_id: businessId };
    if (staffId) {
      whereClause.id = staffId;
    }
    
    // Get staff profiles with all related data
    const staffProfiles = await StaffProfile.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'slug', 'description', 'is_class'],
          through: { attributes: [] }
        },
        {
          model: StaffService,
          attributes: ['id', 'service_id'],
          include: [
            {
              model: BusinessServiceDetail,
              as: 'service_details',
              attributes: ['id', 'name', 'description']
            }
          ]
        },
        {
          model: StaffLocation,
          as: 'locations',
          attributes: ['id', 'location_id'],
          include: [
            {
              model: Location,
              as: 'location',
              attributes: ['id', 'title', 'address', 'city', 'state']
            }
          ]
        },
        {
          model: StaffSchedule,
          attributes: ['id', 'day', 'from', 'to', 'location_id'],
          include: [
            {
              model: Location,
              as: 'location',
              attributes: ['id', 'title', 'address', 'city', 'state']
            }
          ]
        }
      ],
      attributes: [
        'id', 'name', 'email', 'phone_number', 'gender', 
        'profile_photo_url', 'for_class', 'is_available',
        'business_id', 'user_id', 'createdAt', 'updatedAt'
      ],
      order: [['createdAt', 'DESC']]
    });

    
    // Transform the data for better structure
    const transformedData = staffProfiles.map(staff => ({
      id: staff.id,
      name: staff.name,
      email: staff.email,
      phone_number: staff.phone_number,
      gender: staff.gender,
      profile_photo_url: staff.profile_photo_url,
      for_class: staff.for_class,
      is_available: staff.is_available,
      business_id: staff.business_id,
      user_id: staff.user_id,
      created_at: staff.createdAt,
      updated_at: staff.updatedAt,
      categories: staff.categories || [],
      services: staff.StaffServices?.map(service => ({
        id: service.id,
        service_id: service.service_id,
        service_detail: service.service_details
      })) || [],
      locations: staff.locations?.map(location => ({
        id: location.id,
        location_id: location.location_id,
        location_details: location.location
      })) || [],
      schedules: staff.StaffSchedules?.map(schedule => ({
        id: schedule.id,
        day: schedule.day,
        from: schedule.from,
        to: schedule.to,
        location_id: schedule.location_id,
        location: schedule.location
      })) || []
    }));

    return {
      business_id: businessId,
      total_staff: staffProfiles.length,
      staff: transformedData
    };

  } catch (error) {
    console.error('❌ [SERVICE] Error getting staff with comprehensive data:', error);
    throw error;
  }
};  