const { BusinessTranslation } = require('../models/businesstranslation');
const { getAllModels } = require("../../../middlewares/loadModels");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // replace spaces with dashes
    .replace(/[^a-z0-9\-]/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
};

exports.upsertTranslation = async (business_id, { language_code, name, description }) => {
  return await BusinessTranslation.upsert({
    business_id,
    language_code,
    name,
    description
  });
};

exports.getTranslations = async (business_id) => {
  return await BusinessTranslation.findAll({ where: { business_id } });
};

exports.deleteTranslation = async (business_id, language_code) => {
  return await BusinessTranslation.destroy({ where: { business_id, language_code } });
};

exports.saveBusiness = async (userId, data, t) => {
  const { Business, User } = await getAllModels(process.env.DB_TYPE);
  const { business_id, slug, name, ...restData } = data;

  if (!name) throw new Error(t('business.name_required'));

  let business;
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  // Compose new business data
  const businessPayload = {
    ...restData,
    name: name.trim(),
    slug: slug || generateSlug(name),
    user_id: userId,
    user_slug: user.slug,
    is_active: restData.is_active !== undefined ? restData.is_active : true,
  };

  try {
    if (business_id) {
      business = await Business.findOne({ where: { id: business_id, user_id: userId } });

      if (!business) {
        throw new Error(t('business.business_not_found'));
      }

      await business.update(businessPayload);
    } else {
      business = await Business.create({
        ...businessPayload,
        id: uuidv4(),
      });
    }

    return business;

  } catch (err) {
    console.error('Error saving business:', err);
    throw new Error(t('business.save_failed'));
  }
};

const slugify = async (Location, title, attempt = 0) => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with dashes
    .replace(/[^a-z0-9\-]/g, '')  // Remove non-alphanumeric except dashes

  const suffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  const slug = `${baseSlug}-${suffix}`;

  const exists = await Location.findOne({ where: { slug } });
  if (exists) return slugify(Location, title, attempt + 1); // retry
  return slug;
};

exports.saveLocations = async (data, t) => {
  const { Location, Business } = await getAllModels(process.env.DB_TYPE);
  const { locations, business_id } = data;

  if (!Array.isArray(locations)) {
    throw new Error(t('business.location_should_be_array'));
  }

  const business = await Business.findOne({ where: { id: business_id } });
  if (!business) {
    throw new Error(t('business.business_not_found'));
  }

  const existingLocations = await Location.findAll({
    where: { business_id },
    // raw: true,
  });

  const existingMap = new Map();
  existingLocations.forEach(loc => {
    existingMap.set(loc.id, loc);
  });

  const payloadMap = new Map();
  const results = [];

  for (const loc of locations) {
    const payload = {
      business_id,
      title: loc.title,
      address: loc.address,
      floor: loc.floor || null,
      city: loc.city,
      state: loc.state,
      country: loc.country,
      instructions: loc.instructions || null,
      latitude: loc.latitude,
      longitude: loc.longitude,
      is_active: loc.is_active ?? true,
    };

    if (loc.id) {
      // Update existing
      await Location.update(payload, { where: { id: loc.id } });

      // Handle slug update if explicitly provided
      if (loc.slug) {
        await Location.update({ slug: loc.slug }, { where: { id: loc.id } });
      }

      const updated = await Location.findOne({ where: { id: loc.id } });
      results.push(updated);
      payloadMap.set(loc.id, true);
    } else {
      // Create new with generated slug
      const newId = uuidv4();
      const slug = await slugify(Location, loc.title);
      const created = await Location.create({
        id: newId,
        ...payload,
        slug,
      });
      results.push(created);
      payloadMap.set(newId, true);
    }
  }

  const toDelete = existingLocations.filter(loc => !payloadMap.has(loc.id));
  if (toDelete.length) {
    const idsToDelete = toDelete.map(loc => loc.id);
    await Location.destroy({ where: { id: idsToDelete } });
  }

  await Business.update(
    { active_step: 'categories' },
    { where: { id: business_id } }
  );

  return results;
};

exports.saveCategories = async ({ id, business_id, category_id }) => {
  const {
    BusinessCategory,
    Business,
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration,
  } = await getAllModels(process.env.DB_TYPE);

  const payload = { business_id, category_id };

  if (id) {
    const existing = await BusinessCategory.findOne({ where: { id } });    
    if (existing && existing.category_id !== category_id) {
      
      const services = await BusinessService.findAll({
        where: { business_id },
        attributes: ['id'],
        raw: true,
      });

      const serviceIds = services.map(s => s.id);
      
      if (serviceIds.length) {
        const details = await BusinessServiceDetail.findAll({
          where: { service_id: serviceIds },
          attributes: ['id'],
          raw: true,
        });

        const detailIds = details.map(d => d.id);

        await BusinessServiceDuration.destroy({ where: { service_detail_id: detailIds } });
        await BusinessServiceDetail.destroy({ where: { id: detailIds } });
        await BusinessService.destroy({ where: { id: serviceIds } });
      }
    }

    await BusinessCategory.update(payload, { where: { id } });
    return await BusinessCategory.findOne({ where: { id } });

  } else {
    const created = await BusinessCategory.create({
      id: uuidv4(),
      ...payload,
    });

    if (business_id) {
      await Business.update(
        { active_step: 'services' },
        { where: { id: business_id } }
      );
    }

    return created;
  }
};

exports.saveServices = async (data, t) => {
  const { BusinessService, Business, Category } = await getAllModels(process.env.DB_TYPE);

  if (!data || !Array.isArray(data.services)) {
    throw new Error(t('business.service_should_be_array'));
  }

  const businessId = data.services[0]?.business_id;
  if (!businessId) throw new Error(t('business.business_id_required'));

  const existingServices = await BusinessService.findAll({
    where: { business_id: businessId },
    raw: true,
  });

  const allCategoryIds = data.services.map(s => s.category_id);

  const categories = await Category.findAll({
    where: { id: allCategoryIds },
    attributes: ['id', 'is_class'],
    raw: true,
  });

  const categoryMap = new Map(categories.map(cat => [cat.id, cat.is_class]));

  const existingMap = new Map();
  existingServices.forEach(s => {
    existingMap.set(s.category_id, s);
  });

  const payloadMap = new Map();
  data.services.forEach(svc => {
    payloadMap.set(svc.category_id, svc);
  });

  const results = [];

  for (const [category_id, svc] of payloadMap.entries()) {
    const existing = existingMap.get(category_id);
    const is_class = categoryMap.get(category_id);

    if (is_class === undefined) {
      throw new Error(t('category.not_found'));
    }

    const payload = {
      business_id: businessId,
      category_id,
      is_class,
      is_active: svc.is_active ?? true,
    };

    if (existing) {
      await BusinessService.update(payload, { where: { id: existing.id } });
      const updated = await BusinessService.findOne({ where: { id: existing.id } });
      results.push(updated);
    } else {
      const created = await BusinessService.create({
        id: uuidv4(),
        ...payload,
      });
      results.push(created);
    }
  }

  const toDelete = existingServices.filter(s => !payloadMap.has(s.category_id));
  if (toDelete.length) {
    const idsToDelete = toDelete.map(s => s.id);
    await BusinessService.destroy({ where: { id: idsToDelete } });
  }

  await Business.update(
    { active_step: 'service_details' },
    { where: { id: businessId } }
  );

  return results;
};

exports.saveServiceDetails = async (data) => {
  const {
    BusinessServiceDetail,
    BusinessServiceDuration,
    Business,
  } = await getAllModels(process.env.DB_TYPE);

  const createdDetails = [];
  const createdDurations = [];

  for (const detail of data.details) {
    let serviceDetail;

    const detailPayload = {
      business_id: detail.business_id,
      service_id: detail.service_id,
      name: detail.name,
      description: detail.description || null,
    };

    if (detail.id) {
      await BusinessServiceDetail.update(detailPayload, { where: { id: detail.id } });
      serviceDetail = await BusinessServiceDetail.findOne({ where: { id: detail.id } });
    } else {
      serviceDetail = await BusinessServiceDetail.create({
        id: uuidv4(),
        ...detailPayload,
      });
    }

    createdDetails.push(serviceDetail);

    // Handle durations
    if (Array.isArray(detail.durations)) {
      for (const duration of detail.durations) {
        const durationPayload = {
          business_id: detail.business_id,
          service_detail_id: serviceDetail.id,
          duration_minutes: duration.duration_minutes,
          price: duration.price,
          // Only include if value exists (not undefined/null/empty string)
          ...(duration.package_amount != null && duration.package_amount !== ''
            ? { package_amount: duration.package_amount }
            : {}),
          ...(duration.package_person != null && duration.package_person !== ''
            ? { package_person: duration.package_person }
            : {}),
        };

        let savedDuration;

        if (duration.id) {
          await BusinessServiceDuration.update(durationPayload, { where: { id: duration.id } });
          savedDuration = await BusinessServiceDuration.findOne({ where: { id: duration.id } });
        } else {
          savedDuration = await BusinessServiceDuration.create({
            id: uuidv4(),
            ...durationPayload,
          });
        }

        createdDurations.push(savedDuration);
      }
    }
  }

  // Finalize onboarding
  const businessId = data.details[0]?.business_id;
  if (businessId) {
    await Business.update(
      {
        active_step: 'complete_onboarding',
        is_onboarding_complete: true,
      },
      {
        where: { id: businessId },
      }
    );
  }

  return {
    message: 'Onboarding complete',
    details: createdDetails,
    durations: createdDurations,
  };
};

exports.getOnboardingSummary = async (business_id, t) => {
  const {
    Business,
    BusinessTranslation,
    Location,
    BusinessHour,
    BusinessCategory,
    Category,
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration,
  } = await getAllModels(process.env.DB_TYPE);

  const business = await Business.findOne({
    where: { id: business_id },
    include: [
      {
        model: BusinessTranslation,
        as: 'translations',
      },
      {
        model: Location,
        as: 'locations',
        include: [
          {
            model: BusinessHour,
            as: 'business_hours',
          },
        ],
      },
      {
        model: BusinessCategory,
        as: 'business_categories',
        include: [
          {
            model: Category,
            as: 'category',
          },
        ],
      },
      {
        model: BusinessService,
        as: 'business_services',
        include: [
          {
            model: Category,
            as: 'category',
          },
          {
            model: BusinessServiceDetail,
            as: 'service_details',
            include: [
              {
                model: BusinessServiceDuration,
                as: 'durations',
              },
            ],
          },
        ],
      },
    ],
  });

  return business;
};

exports.getBusinessDetailsBySlug = async (slug, t) => {
  const {
    Business,
    BusinessTranslation,
    Location,
    BusinessHour,
  } = await getAllModels(process.env.DB_TYPE);

  const business = await Business.findOne({
    where: { slug },
    include: [
      {
        model: BusinessTranslation,
        as: 'translations',
      },
      {
        model: Location,
        as: 'locations',
        include: [
          {
            model: BusinessHour,
            as: 'business_hours',
          },
        ],
      },
    ],
  });

  if (!business) {
    return {
      status: 404,
      success: false,
      message: 'No business found with this slug',
    };
  }

  return {
    status: 200,
    success: true,
    data: business,
  };
};

exports.getLocationSummary = async (slug, t) => {
  const {
    Location,
    Business,
    BusinessHour,
    BusinessTranslation,
    BusinessCategory,
    Category,
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration,
    StaffProfile,
    StaffSchedule,
    Class,
    ClassTranslation,
    ClassSchedule,
  } = await getAllModels(process.env.DB_TYPE);

  const location = await Location.findOne({
    where: { slug },
    include: [
      {
        model: Business,
        as: 'business_details',
        include: [
          {
            model: BusinessTranslation,
            as: 'translations',
          },
          {
            model: BusinessCategory,
            as: 'business_categories',
            include: [
              {
                model: Category,
                as: 'category',
              },
            ],
          },
          {
            model: BusinessService,
            as: 'business_services',
            include: [
              {
                model: BusinessServiceDetail,
                as: 'service_details',
                include: [
                  {
                    model: BusinessServiceDuration,
                    as: 'durations',
                     separate: true, // Ensure separate queries for durations
                  },
                ],
              },
              {
                model: Category,
                as: 'category',
              },
            ],
          },
          {
            model: Class,
            as: 'classes', // ✅ corrected alias
            include: [
              {
                model: ClassTranslation,
              },
              {
                model: ClassSchedule,
              },
            ],
          },
        ],
      },
      {
        model: BusinessHour,
        as: 'business_hours',
      }
    ],
  });

const StaffProfiles = await StaffProfile.findAll({
  where: {
    location_id: {
      [Op.contains]: [location.id]
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

location.setDataValue('staff_profiles', StaffProfiles);

  if (!location) {
    return {
      status: 404,
      success: false,
      message: 'No location found with this slug',
    };
  }

  return {
    status: 200,
    success: true,
    data: location,
  };
};

exports.getOtherLocations = async (businessId, currentLocationId) => {
  const {
    Location,
  } = await getAllModels(process.env.DB_TYPE);
  const locations = await Location.findAll({
    where: {
      business_id: businessId,
      id: { [Op.ne]: currentLocationId }, // Exclude current
      is_active: true,
    },
    order: [['createdAt', 'ASC']],
  });

  return locations;
};

exports.getBusinessServicesById = async (business_id) => {
  const {
    Category,
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration
  } = await getAllModels(process.env.DB_TYPE);

  const services = await BusinessServiceDetail.findAll({
    where: {
      business_id,
    },
    attributes: [
      "name",
      "description"
    ],
    include: [
      {
        model: BusinessService,
        where: {is_active:true},
        as: 'business_service',
        attributes: [
          "id",
          "is_class",
        ],
        include: [
         { 
          model: Category,
          as: 'category',
          attributes: [
            "id",
            "name",
            "level"
          ]
        }
        ]
      },
      {
        model: BusinessServiceDuration,
        as: 'durations',
        attributes: [
          'id',
          'duration_minutes',
          'price',
          'package_amount',
          'package_person',
        ]

      }
    ],
    order: [['createdAt', 'ASC']],
  });

return {
      status: 200,
      success: true,
      message: 'found Business service detials',
      business_services_details: services,
    };
};

exports.fetchServiceDetails = async (businessId) => {
  const {
    BusinessCategory,
    Category,
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration
  } = await getAllModels(process.env.DB_TYPE);

  const business_categories = await BusinessCategory.findAll({
    where: { business_id: businessId },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      }
    ],
  });

  const business_services = await BusinessService.findAll({
    where: { business_id: businessId },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
      {
        model: BusinessServiceDetail,
        as: 'service_details',
        include: [
          {
            model: BusinessServiceDuration,
            as: 'durations',
          }
        ]
      }
    ],
  });

  return { business_categories, business_services };
};

exports.saveOfferingCategories = async ({ id, business_id, category_id }) => {
  const {
    BusinessCategory,
    Business,
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration,
  } = await getAllModels(process.env.DB_TYPE);

  const payload = { business_id, category_id };

  if (id) {
    const existing = await BusinessCategory.findOne({ where: { id } });    
    if (existing && existing.category_id !== category_id) {
      
      const services = await BusinessService.findAll({
        where: { business_id },
        attributes: ['id'],
        raw: true,
      });

      const serviceIds = services.map(s => s.id);
      
      if (serviceIds.length) {
        const details = await BusinessServiceDetail.findAll({
          where: { service_id: serviceIds },
          attributes: ['id'],
          raw: true,
        });

        const detailIds = details.map(d => d.id);

        await BusinessServiceDuration.destroy({ where: { service_detail_id: detailIds } });
        await BusinessServiceDetail.destroy({ where: { id: detailIds } });
        await BusinessService.destroy({ where: { id: serviceIds } });
      }
    }

    await BusinessCategory.update(payload, { where: { id } });
    return await BusinessCategory.findOne({ where: { id } });

  } else {
    const created = await BusinessCategory.create({
      id: uuidv4(),
      ...payload,
    });

    if (business_id) {
      await Business.update(
        { active_step: 'services' },
        { where: { id: business_id } }
      );
    }

    return created;
  }
};

exports.saveOfferingServices = async (data, t) => {
  const { BusinessService, Business, Category } = await getAllModels(process.env.DB_TYPE);

  if (!data || !Array.isArray(data.services)) {
    throw new Error(t('business.service_should_be_array'));
  }

  const businessId = data.services[0]?.business_id;
  if (!businessId) throw new Error(t('business.business_id_required'));

  const existingServices = await BusinessService.findAll({
    where: { business_id: businessId },
    raw: true,
  });

  const allCategoryIds = data.services.map(s => s.category_id);

  const categories = await Category.findAll({
    where: { id: allCategoryIds },
    attributes: ['id', 'is_class'],
    raw: true,
  });

  const categoryMap = new Map(categories.map(cat => [cat.id, cat.is_class]));

  const existingMap = new Map();
  existingServices.forEach(s => {
    existingMap.set(s.category_id, s);
  });

  const payloadMap = new Map();
  data.services.forEach(svc => {
    payloadMap.set(svc.category_id, svc);
  });

  const results = [];

  for (const [category_id, svc] of payloadMap.entries()) {
    const existing = existingMap.get(category_id);
    const is_class = categoryMap.get(category_id);

    if (is_class === undefined) {
      throw new Error(t('category.not_found'));
    }

    const payload = {
      business_id: businessId,
      category_id,
      is_class,
      is_active: svc.is_active ?? true,
    };

    if (existing) {
      await BusinessService.update(payload, { where: { id: existing.id } });
      const updated = await BusinessService.findOne({ where: { id: existing.id } });
      results.push(updated);
    } else {
      const created = await BusinessService.create({
        id: uuidv4(),
        ...payload,
      });
      results.push(created);
    }
  }

  const toDelete = existingServices.filter(s => !payloadMap.has(s.category_id));
  if (toDelete.length) {
    const idsToDelete = toDelete.map(s => s.id);
    await BusinessService.destroy({ where: { id: idsToDelete } });
  }

  await Business.update(
    { active_step: 'service_details' },
    { where: { id: businessId } }
  );

  return results;
};

exports.saveOfferingServiceDetails = async (data, t) => {
  const {
    BusinessServiceDetail,
    BusinessServiceDuration,
    ServiceStaff,
    ServiceTag,
    ServiceMedia,
    ServiceLocationOverride,
    Business,
    Category,
    BusinessService
  } = await getAllModels(process.env.DB_TYPE);
  console.log('data', data);
  
  const createdDetails = [];

  for (const detail of data.details) {
    let businessService;
    
    // ✅ Step 1: Handle different input scenarios
    if (detail.service_id) {
      // If service_id is provided, use the existing service or create it
      businessService = await BusinessService.findByPk(detail.service_id);
      console.log('businessService:-------', !businessService,'    ----------');
      
      if (!businessService) {
        // Check if category_id is provided in the payload
        if (!detail.category_id) {
          // If no category_id provided, try to use service_id as category_id
          const category = await Category.findByPk(detail.service_id);
          if (!category) {
            throw new Error('category_id is required when creating a new BusinessService, or service_id must be a valid category_id');
          }
          detail.category_id = detail.service_id; // Use service_id as category_id
        }
        
        // Create the BusinessService if it doesn't exist
        businessService = await BusinessService.create({
          id: detail.service_id, // Use the provided service_id
          business_id: detail.business_id,
          category_id: detail.category_id,
          is_class: detail.is_class || false,
          is_active: true
        });
        console.log(`Created new BusinessService with ID: ${detail.service_id}`);
      }
    } else {
      // If category IDs are provided, validate and create/find service
      const categoryLevel0 = await Category.findByPk(detail.category_level_0_id);
      const categoryLevel1 = await Category.findByPk(detail.category_level_1_id);
      const categoryLevel2 = detail.category_level_2_id ? await Category.findByPk(detail.category_level_2_id) : null;
      
      if (!categoryLevel0 || !categoryLevel1) {
        throw new Error('Invalid category selection: category_level_0_id and category_level_1_id are required');
      }
      
      // Determine which category level to use for the BusinessService
      // Priority: level 2 > level 1 > level 0
      let selectedCategoryId = detail.category_level_1_id; // Default to level 1
      if (categoryLevel2) {
        selectedCategoryId = detail.category_level_2_id; // Use level 2 if available
      }
      
      // ✅ Step 2: Create or find BusinessService
      businessService = await BusinessService.findOne({
        where: {
          business_id: detail.business_id,
          category_id: selectedCategoryId
        }
      });
      
      if (!businessService) {
        businessService = await BusinessService.create({
          id: uuidv4(),
          business_id: detail.business_id,
          category_id: selectedCategoryId,
          is_class: detail.is_class || false,
          is_active: true
        });
      }
    }

    // ✅ Step 3: Create BusinessServiceDetail
    let serviceDetail;
    const detailPayload = {
      business_id: detail.business_id,
      service_id: businessService.id, // Link to the BusinessService we just created
      name: detail.name,
      description: detail.description || null,
      is_class: detail.is_class || false,
      is_archived: detail.is_archived || false,
    };

    if (detail.id) {
      await BusinessServiceDetail.update(detailPayload, { where: { id: detail.id } });
      serviceDetail = await BusinessServiceDetail.findOne({ where: { id: detail.id } });
    } else {
      serviceDetail = await BusinessServiceDetail.create({
        id: uuidv4(),
        ...detailPayload,
      });
    }

    // ✅ Handle durations
    if (Array.isArray(detail.durations)) {
      await BusinessServiceDuration.destroy({ where: { service_detail_id: serviceDetail.id } });

      for (const duration of detail.durations) {
        await BusinessServiceDuration.create({
          id: uuidv4(),
          business_id: detail.business_id,
          service_detail_id: serviceDetail.id,
          duration_minutes: duration.duration_minutes,
          price: duration.price,
          ...(duration.package_amount && { package_amount: duration.package_amount }),
          ...(duration.package_person && { package_person: duration.package_person }),
        });
      }
    }

    // ✅ Handle staff assignments (only if ServiceStaff model exists)
    if (Array.isArray(detail.staff_ids) && ServiceStaff) {
      await ServiceStaff.destroy({ where: { service_detail_id: serviceDetail.id } });
      for (const staff_id of detail.staff_ids) {
        await ServiceStaff.create({
          id: uuidv4(),
          service_detail_id: serviceDetail.id,
          staff_profile_id: staff_id,
        });
      }
    }

    // ✅ Handle tags (only if ServiceTag model exists)
    if (Array.isArray(detail.tags) && ServiceTag) {
      await ServiceTag.destroy({ where: { service_detail_id: serviceDetail.id } });
      for (const tag of detail.tags) {
        await ServiceTag.create({
          id: uuidv4(),
          service_detail_id: serviceDetail.id,
          tag,
        });
      }
    }

    // ✅ Handle media (only if ServiceMedia model exists)
    if (detail.media_url && ServiceMedia) {
      await ServiceMedia.upsert({
        service_detail_id: serviceDetail.id,
        media_url: detail.media_url,
      });
    }

    // ✅ Handle location-specific pricing (only if ServiceLocationOverride model exists)
    if (Array.isArray(detail.location_pricing) && ServiceLocationOverride) {
      await ServiceLocationOverride.destroy({ where: { service_detail_id: serviceDetail.id } });
      for (const location of detail.location_pricing) {
        await ServiceLocationOverride.create({
          id: uuidv4(),
          service_detail_id: serviceDetail.id,
          location_id: location.location_id,
          duration_minutes: location.duration_minutes,
          price: location.price,
        });
      }
    }

    // Get category information for response
    let categoryLevel0 = null;
    let categoryLevel1 = null;
    
    if (detail.category_level_0_id && detail.category_level_1_id) {
      categoryLevel0 = await Category.findByPk(detail.category_level_0_id);
      categoryLevel1 = await Category.findByPk(detail.category_level_1_id);
    } else if (businessService.category_id) {
      // If using service_id, get the category from the business service
      categoryLevel1 = await Category.findByPk(businessService.category_id);
    }
    
    createdDetails.push({
      ...serviceDetail.toJSON(),
      business_service: businessService,
      category_level_0: categoryLevel0,
      category_level_1: categoryLevel1
    });
  }

  // ✅ Mark onboarding complete
  const businessId = data.details[0]?.business_id;
  if (businessId) {
    await Business.update(
      { active_step: 'complete_onboarding', is_onboarding_complete: true },
      { where: { id: businessId } }
    );
  }

  return {
    message: 'Offerings saved successfully',
    details: createdDetails,
  };
};

exports.getClassBasedServices = async (business_id) => {
  const {
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration
  } = await getAllModels(process.env.DB_TYPE);

  // Get all class-based services for the business
  const classServices = await BusinessService.findAll({
    where: {
      business_id,
      is_class: true,
      is_active: true
    },
    include: [
      {
        model: BusinessServiceDetail,
        as: 'service_details',
        include: [
          {
            model: BusinessServiceDuration,
            as: 'durations'
          }
        ]
      }
    ]
  });

  return classServices;
};

exports.getCreatedOfferings = async (business_id) => {
  const {
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration,
    Category
  } = await getAllModels(process.env.DB_TYPE);

  const offerings = await BusinessService.findAll({
    where: {
      business_id,
      is_active: true
    },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'description', 'is_class', 'level', 'parent_id'],
        include: [
          {
            model: Category,
            as: 'parent',
            attributes: ['id', 'name', 'slug', 'description', 'is_class', 'level', 'parent_id'],
            required: false,
            include: [
              {
                model: Category,
                as: 'parent',
                attributes: ['id', 'name', 'slug', 'description', 'is_class', 'level', 'parent_id'],
                required: false
              }
            ]
          }
        ]
      },
      {
        model: BusinessServiceDetail,
        as: 'service_details',
        attributes: ['id', 'name', 'description', 'created_at', 'updated_at'],
        include: [
          {
            model: BusinessServiceDuration,
            as: 'durations',
            attributes: ['id', 'duration_minutes', 'price', 'package_amount', 'package_person']
          }
        ]
      }
    ],
    order: [
      ['createdAt', 'DESC'],
      [{ model: BusinessServiceDetail, as: 'service_details' }, 'created_at', 'DESC']
    ]
  });

  const transformedOfferings = offerings.map(offering => {
    const offeringData = offering.toJSON();
    
    // Build category hierarchy
    const category = offeringData.category;
    if (category) {
      // Find root parent (level 0)
      let rootParent = category;
      while (rootParent.parent && rootParent.level !== 0) {
        rootParent = rootParent.parent;
      }

      // Build nested parent structure
      let currentParent = null;
      if (category.level === 2 && category.parent) {
        currentParent = {
          id: category.parent.id,
          name: category.parent.name,
          level: category.parent.level,
          parent: category.parent.parent ? {
            id: category.parent.parent.id,
            name: category.parent.parent.name,
            level: category.parent.parent.level
          } : null
        };
      } else if (category.level === 1 && category.parent) {
        currentParent = {
          id: category.parent.id,
          name: category.parent.name,
          level: category.parent.level,
          is_class: category.parent.is_class,
        };
      }

      // Update category structure
      offeringData.category = {
        id: category.id,
        name: category.name,
        level: category.level,
        parent: currentParent,
        root_parent: {
          id: rootParent.id,
          name: rootParent.name,
          is_class: rootParent.is_class,
        }
      };
    }

    return offeringData;
  });

  return {
    offerings: transformedOfferings
  };
};

exports.getLevel0CategoriesByBusinessId = async (business_id, t) => {
  const {
    BusinessService,
    Category
  } = await getAllModels(process.env.DB_TYPE);

  // 1. Get all BusinessServices for the business
  const businessServices = await BusinessService.findAll({
    where: {
      business_id,
      is_active: true
    },
    attributes: ['id', 'business_id', 'category_id'],
    raw: true
  });

  // 2. Extract unique category IDs
  const categoryIds = [...new Set(businessServices.map(bs => bs.category_id))];

  // 3. Get all categories and find their level 0 parents
  const categories = await Category.findAll({
    where: {
      id: categoryIds
    },
    attributes: ['id', 'name', 'slug', 'description', 'is_class', 'level', 'parent_id'],
    include: [
      {
        model: Category,
        as: 'parent',
        attributes: ['id', 'name', 'slug', 'description', 'is_class', 'level'],
        required: false
      }
    ]
  });

  // 4. Get level 0 categories (either direct level 0 or parent of level 0)
  const level0Categories = [];
  const processedLevel0Ids = new Set();

  for (const category of categories) {
    let level0Category = null;
    
    // If category is level 0, use it directly
    if (category.level === 0) {
      level0Category = category;
    }
    // If category has a parent and parent is level 0, use the parent
    else if (category.parent && category.parent.level === 0) {
      level0Category = category.parent;
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
            attributes: ['id', 'name', 'slug', 'description', 'is_class', 'level'],
            required: false
          }]
        });
        if (parentCategory && parentCategory.level === 0) {
          level0Category = parentCategory;
          break;
        }
        currentParent = parentCategory?.parent;
      }
    }

    // Add to level 0 categories if found and not already processed
    if (level0Category && !processedLevel0Ids.has(level0Category.id)) {
      level0Categories.push({
        id: level0Category.id,
        name: level0Category.name,
        slug: level0Category.slug,
        description: level0Category.description,
        is_class: level0Category.is_class,
        level: level0Category.level
      });
      processedLevel0Ids.add(level0Category.id);
    }
  }

  return {
    business_id,
    total_level0_categories: level0Categories.length,
    level0_categories: level0Categories
  };
};

exports.getServiceDetailById = async (serviceDetailId) => {
  const { 
    BusinessServiceDetail, 
    BusinessService, 
    BusinessServiceDuration, 
    BusinessCategory,
    Category,
    Business 
  } = await getAllModels(process.env.DB_TYPE);

  try {
    const serviceDetail = await BusinessServiceDetail.findByPk(serviceDetailId, {
      include: [
        {
          model: BusinessService,
          as: 'business_service',
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name', 'slug', 'description', 'level', 'is_class', 'is_active']
            },
            {
              model: Business,
              attributes: ['id', 'name', 'is_active']
            }
          ],
          attributes: ['id', 'business_id', 'category_id', 'is_class', 'is_active', 'createdAt', 'updatedAt']
        },
        {
          model: BusinessServiceDuration,
          as: 'durations',
          attributes: [
            'id', 'business_id', 'service_detail_id', 'duration_minutes', 
            'price', 'package_amount', 'package_person', 'createdAt', 'updatedAt'
          ]
        },
        {
          model: Business,
          attributes: ['id', 'name', 'is_active', 'createdAt', 'updatedAt']
        }
      ],
      attributes: [
        'id', 'business_id', 'service_id', 'name', 'description', 
        'createdAt', 'updatedAt'
      ]
    });

    if (!serviceDetail) {
      throw new Error('Service detail not found');
    }

    // Get related business categories
    const businessCategories = await BusinessCategory.findAll({
      where: {
        business_id: serviceDetail.business_id
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'description', 'level', 'is_class', 'is_active']
        }
      ],
      attributes: ['id', 'business_id', 'category_id', 'createdAt', 'updatedAt']
    });

    // Format the response
    const result = {
      service_detail: {
        id: serviceDetail.id,
        name: serviceDetail.name,
        description: serviceDetail.description,
        business_id: serviceDetail.business_id,
        service_id: serviceDetail.service_id,
        created_at: serviceDetail.createdAt,
        updated_at: serviceDetail.updatedAt,
        business_service: {
          id: serviceDetail.business_service.id,
          business_id: serviceDetail.business_service.business_id,
          category_id: serviceDetail.business_service.category_id,
          is_class: serviceDetail.business_service.is_class,
          is_active: serviceDetail.business_service.is_active,
          category: serviceDetail.business_service.category,
          business: serviceDetail.business_service.Business ? {
            id: serviceDetail.business_service.Business.id,
            name: serviceDetail.business_service.Business.name,
            is_active: serviceDetail.business_service.Business.is_active
          } : null
        },
        durations: serviceDetail.durations.map(duration => ({
          id: duration.id,
          business_id: duration.business_id,
          service_detail_id: duration.service_detail_id,
          duration_minutes: duration.duration_minutes,
          price: duration.price,
          package_amount: duration.package_amount,
          package_person: duration.package_person,
          created_at: duration.createdAt,
          updated_at: duration.updatedAt
        })),
        business: serviceDetail.business ? {
          id: serviceDetail.business.id,
          name: serviceDetail.business.name,
          is_active: serviceDetail.business.is_active
        } : null
      },
      business_categories: businessCategories.map(bc => ({
        id: bc.id,
        business_id: bc.business_id,
        category_id: bc.category_id,
        category: bc.category,
        created_at: bc.createdAt,
        updated_at: bc.updatedAt
      }))
    };

    return result;
  } catch (error) {
    console.error('Error in getServiceDetailById:', error);
    throw error;
  }
};

exports.updateServiceDetailById = async (serviceDetailId, updateData) => {
  const { 
    BusinessServiceDetail, 
    BusinessServiceDuration
  } = await getAllModels(process.env.DB_TYPE);

  try {
    // Find the existing service detail
    const existingServiceDetail = await BusinessServiceDetail.findByPk(serviceDetailId);
    if (!existingServiceDetail) {
      throw new Error('Service detail not found');
    }

    // Update the service detail
    const updatedServiceDetail = await BusinessServiceDetail.update(
      {
        name: updateData.name,
        description: updateData.description
      },
      {
        where: { id: serviceDetailId },
        returning: true
      }
    );

    // Handle durations update
    if (updateData.durations && Array.isArray(updateData.durations)) {
      for (const duration of updateData.durations) {
        if (duration.id) {
          // Update existing duration
          await BusinessServiceDuration.update(
            {
              duration_minutes: duration.duration_minutes,
              price: duration.price,
              package_amount: duration.package_amount,
              package_person: duration.package_person
            },
            {
              where: { 
                id: duration.id,
                service_detail_id: serviceDetailId 
              }
            }
          );
        } else {
          // Create new duration
          await BusinessServiceDuration.create({
            business_id: existingServiceDetail.business_id,
            service_detail_id: serviceDetailId,
            duration_minutes: duration.duration_minutes,
            price: duration.price,
            package_amount: duration.package_amount,
            package_person: duration.package_person
          });
        }
      }
    }

    // Get the updated service detail with durations
    const result = await BusinessServiceDetail.findByPk(serviceDetailId, {
      include: [
        {
          model: BusinessServiceDuration,
          as: 'durations',
          attributes: [
            'id', 'business_id', 'service_detail_id', 'duration_minutes', 
            'price', 'package_amount', 'package_person', 'createdAt', 'updatedAt'
          ]
        }
      ],
      attributes: [
        'id', 'business_id', 'service_id', 'name', 'description', 
        'createdAt', 'updatedAt'
      ]
    });

    return {
      success: true,
      message: 'Service detail updated successfully',
      data: {
        id: result.id,
        name: result.name,
        description: result.description,
        business_id: result.business_id,
        service_id: result.service_id,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
        durations: result.durations.map(duration => ({
          id: duration.id,
          business_id: duration.business_id,
          service_detail_id: duration.service_detail_id,
          duration_minutes: duration.duration_minutes,
          price: duration.price,
          package_amount: duration.package_amount,
          package_person: duration.package_person,
          created_at: duration.createdAt,
          updated_at: duration.updatedAt
        }))
      }
    };
  } catch (error) {
    console.error('Error in updateServiceDetailById:', error);
    throw error;
  }
};