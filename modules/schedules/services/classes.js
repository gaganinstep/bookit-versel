const { Op } = require('sequelize');
const { getAllModels } = require('../../../middlewares/loadModels');

exports.createClass = async (data) => {
    const { Class } = await getAllModels(process.env.DB_TYPE);
  return await Class.create(data);
};

exports.getClassById = async (id) => {
  const { 
    BusinessService, 
    ClassSchedule, 
    ClassScheduleInstructor, 
    StaffProfile, 
    Location, 
    BusinessServiceDetail, 
    BusinessServiceDuration 
  } = await getAllModels(process.env.DB_TYPE);

  // Get the class (BusinessService) with all related data
  const classData = await BusinessService.findByPk(id, {
    include: [
      {
        model: BusinessServiceDetail,
        as: 'service_details',
        attributes: [ 'name', 'description'],
        include: [
          {
            model: BusinessServiceDuration,
            as: 'durations',
            attributes: [ 'duration_minutes', 'price', 'package_amount', 'package_person']
          }
        ]
      },
      {
        model: ClassSchedule,
        as: 'schedules',
        include: [
          {
            model: Location,
            as: 'Location',
            attributes: ['id','title', 'address', 'floor', 'city', 'state', 'country', 'latitude', 'longitude', 'instructions', 'is_active', 'slug']
          },
          {
            model: ClassScheduleInstructor,
            as: 'instructors',
            include: [
              {
                model: StaffProfile,
                as: 'instructor',
                attributes: [ 'id', 'name', 'email', 'phone_number']
              }
            ]
          }
        ],
        order: [
          ['day_of_week', 'ASC'],
          ['start_time', 'ASC']
        ]
      }
    ]
  });

  if (!classData) {
    throw new Error('Class not found');
  }

  // Get ClassSchedule data with id and class_id
  const classSchedules = await ClassSchedule.findAll({
    where: { class_id: id },
    attributes: ['id', 'class_id'],
    order: [['createdAt', 'ASC']]
  });

  // Transform the data to a more organized structure
  const transformedData = {
    class_id: classData.id, // BusinessService ID as class_id
    id: classData.id,
    business_id: classData.business_id,
    category: classData.category,
    is_class: classData.is_class,
    is_active: classData.is_active,
    
    // Service details
    service_details: classData.service_details?.map(detail => ({
      id: detail.id,
      name: detail.name,
      description: detail.description,
      created_at: detail.created_at,
      updated_at: detail.updated_at,
      durations: detail.durations || []
    })) || [],
    
    // Schedules with locations and instructors
    schedules: classData.schedules?.map(schedule => ({
      id: schedule.id,
      location: {
        id: schedule.Location.id,
        title: schedule.Location.title,
        address: schedule.Location.address,
        floor: schedule.Location.floor,
        city: schedule.Location.city,
        state: schedule.Location.state,
        country: schedule.Location.country,
        latitude: schedule.Location.latitude,
        longitude: schedule.Location.longitude,
        instructions: schedule.Location.instructions,
        is_active: schedule.Location.is_active,
        slug: schedule.Location.slug
      },
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      price: schedule.price,
      package_amount: schedule.package_amount,
      package_person: schedule.package_person,
      instructors: schedule.instructors?.map(instructor => ({
        id: instructor.instructor.id,
        name: instructor.instructor.name,
        email: instructor.instructor.email,
        phone_number: instructor.instructor.phone_number,
        profile_photo_url: instructor.instructor.profile_photo_url,
        bio: instructor.instructor.bio,
        specializations: instructor.instructor.specializations
      })) || []
    })) || [],
    
    // ClassSchedule data with id and class_id
    class_schedules: classSchedules.map(schedule => ({
      id: schedule.id,
      class_id: schedule.class_id
    })),
    
    // Summary statistics
    total_locations: classData.schedules?.length || 0,
    total_instructors: classData.schedules?.reduce((total, schedule) => 
      total + (schedule.instructors?.length || 0), 0) || 0,
    total_durations: classData.service_details?.reduce((total, detail) => 
      total + (detail.durations?.length || 0), 0) || 0,
    total_class_schedules: classSchedules.length
  };

  return transformedData;
};

exports.updateClass = async (id, data) => {
    const { Class } = await getAllModels(process.env.DB_TYPE);
  return await Class.update(data, { where: { id } });
};

exports.deleteClass = async (id) => {
    const { Class } = await getAllModels(process.env.DB_TYPE);
  return await Class.update({ status: 'cancelled' }, { where: { id } });
};

exports.listClasses = async (query) => {
    const { Class } = await getAllModels(process.env.DB_TYPE);
  const { service_id, staff_profile_id, status, q, limit = 10, offset = 0 } = query;
  const where = {};
  if (service_id) where.service_id = service_id;
  if (staff_profile_id) where.staff_profile_id = staff_profile_id;
  if (status) where.status = status;
  if (q) where.meeting_link = { [Op.iLike]: `%${q}%` };

  return await Class.findAndCountAll({ where, limit, offset, order: [['start_time', 'ASC']] });
};

exports.getClassesByLocation = async (locationId) => {
  const { BusinessService, ClassSchedule, ClassScheduleInstructor, StaffProfile, Location, BusinessServiceDetail, BusinessServiceDuration, Category } = await getAllModels(process.env.DB_TYPE);
  
  // First, get all class IDs that have schedules for this location
  const classIds = await ClassSchedule.findAll({
    where: { location_id: locationId },
    attributes: ['class_id'],
    raw: true
  }).then(schedules => schedules.map(s => s.class_id));

  if (classIds.length === 0) {
    return [];
  }

  // Then fetch the classes with their details
  const classes = await BusinessService.findAll({
    where: {
      id: { [Op.in]: classIds },
      is_class: true
    },
    include: [
      {
        model: ClassSchedule,
        as: 'schedules',
        where: { location_id: locationId },
        include: [
          {
            model: ClassScheduleInstructor,
            as: 'instructors',
            include: [
              {
                model: StaffProfile,
                as: 'instructor',
                attributes: ['id', 'name', 'email', 'phone_number', 'profile_photo_url']
              }
            ]
          },
          {
            model: Location,
            as: 'Location',
            attributes: ['id', 'title', 'address', 'city', 'state', 'country']
          }
        ]
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'description']
      },
      {
        model: BusinessServiceDetail,
        as: 'service_details',
        attributes: ['id', 'name', 'description'],
        required: false, // Left join to get name if available
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
      ['schedules', 'day_of_week', 'ASC'],
      ['schedules', 'start_time', 'ASC']
    ]
  });

  return classes;
};

exports.getClassesByBusiness = async (businessId, filters = {}) => {
  const { BusinessService, ClassSchedule, ClassScheduleInstructor, StaffProfile, Location, Category, BusinessServiceDetail, BusinessServiceDuration } = await getAllModels(process.env.DB_TYPE);
  
  const {
    locationId,
    day,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = filters;
  
  // Build where clause for BusinessService
  const whereClause = {
    business_id: businessId,
    is_class: true
  };
  
  // Build include clause for schedules
  const scheduleInclude = {
    model: ClassSchedule,
    as: 'schedules',
    include: [
      {
        model: ClassScheduleInstructor,
        as: 'instructors',
        include: [
          {
            model: StaffProfile,
            as: 'instructor',
            attributes: ['id', 'name', 'email', 'phone_number', 'profile_photo_url']
          }
        ]
      },
      {
        model: Location,
        as: 'Location',
        attributes: ['id', 'title', 'address', 'city', 'state', 'country']
      }
    ]
  };
  
  // Add location filter if provided
  if (locationId) {
    scheduleInclude.where = { location_id: locationId };
  }
  
  // Add day filter if provided
  if (day) {
    if (scheduleInclude.where) {
      scheduleInclude.where.day_of_week = day;
    } else {
      scheduleInclude.where = { day_of_week: day };
    }
  }
  
  // Build order clause
  let orderClause = [[sortBy, sortOrder]];
  
  // If filtering by day, order by time within that day
  if (day) {
    orderClause = [
      ['schedules', 'start_time', 'ASC']
    ];
  } else {
    // Default ordering for classes
    orderClause = [
      ['schedules', 'day_of_week', 'ASC'],
      ['schedules', 'start_time', 'ASC']
    ];
  }
  
  // Calculate offset for pagination
  const offset = (page - 1) * limit;
  
  // Fetch classes with pagination
  const result = await BusinessService.findAndCountAll({
    where: whereClause,
    include: [
      scheduleInclude,
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'description']
      },
      {
        model: BusinessServiceDetail,
        as: 'service_details',
        attributes: ['id', 'name', 'description'],
        required: false, // Left join to get name if available
        include: [
          {
            model: BusinessServiceDuration,
            as: 'durations',
            attributes: ['id', 'duration_minutes', 'price', 'package_amount', 'package_person']
          }
        ]
      }
    ],
    order: orderClause,
    limit: parseInt(limit),
    offset: offset,
    distinct: true // Important for correct count with includes
  });
  
  // Transform the data to include only the required fields
  const transformedRows = result.rows.map(classItem => {
    const serviceDetail = classItem.service_details && classItem.service_details.length > 0 
      ? classItem.service_details[0] 
      : null;
    
    const serviceName = serviceDetail ? serviceDetail.name : null;
    const serviceDescription = serviceDetail ? serviceDetail.description : null;
    const durations = serviceDetail && serviceDetail.durations ? serviceDetail.durations : [];
    
    console.log('serviceDetail:-------', serviceDetail);
    
    return {
      business_id: classItem.business_id,
      category_id: classItem.category_id,
      service_name: serviceName,
      service_description: serviceDescription,
      durations: durations,
      // Include full data if needed
      full_data: classItem
    };
  });
  
  return {
    rows: transformedRows,
    count: result.count
  };
};

exports.createClassWithSchedule = async (data) => {
  console.log('🔍 [SERVICE] createClassWithSchedule - Starting service');
  console.log('📦 [SERVICE] Input data:', JSON.stringify(data, null, 2));
  
  const {
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration,
    ClassSchedule,
    ClassScheduleInstructor
  } = await getAllModels(process.env.DB_TYPE);

  console.log('✅ [SERVICE] Models loaded successfully');

  const { service_detail, location_schedules } = data;
  console.log('📋 [SERVICE] Extracted service_detail and location_schedules');

  // Start a transaction to ensure data consistency
  const transaction = await BusinessService.sequelize.transaction();
  console.log('🔄 [SERVICE] Transaction started');

  try {
    // 1. Check if BusinessService already exists, if not create it
    console.log('🏗️ [SERVICE] Step 1: Checking if BusinessService exists');
    const classData = {
      business_id: service_detail.business_id,
      category_id: service_detail.category_id,
      is_class: service_detail.is_class,
      is_active: service_detail.is_active !== undefined ? service_detail.is_active : true
    };
    console.log('📝 [SERVICE] Class data:', JSON.stringify(classData, null, 2));

    // Check if BusinessService already exists
    let createdClass = await BusinessService.findOne({
      where: {
        business_id: service_detail.business_id,
        category_id: service_detail.category_id,
        is_class: service_detail.is_class
      }
    });

    if (createdClass) {
      console.log('✅ [SERVICE] BusinessService already exists with ID:', createdClass.id);
    } else {
      console.log('🏗️ [SERVICE] Creating new BusinessService');
      createdClass = await BusinessService.create(classData, { transaction });
      console.log('✅ [SERVICE] BusinessService created with ID:', createdClass.id);
    }

    // 2. Create the BusinessServiceDetail
    console.log('🏗️ [SERVICE] Step 2: Creating BusinessServiceDetail');
    const serviceDetailData = {
      business_id: service_detail.business_id,
      service_id: createdClass.id,
      name: service_detail.name,
      description: service_detail.description || ''
    };
    console.log('📝 [SERVICE] Service detail data:', JSON.stringify(serviceDetailData, null, 2));

    const createdServiceDetail = await BusinessServiceDetail.create(serviceDetailData, { transaction });
    console.log('✅ [SERVICE] BusinessServiceDetail created with ID:', createdServiceDetail.id);

    // 3. Create the BusinessServiceDurations
    console.log('🏗️ [SERVICE] Step 3: Creating BusinessServiceDurations');
    const createdDurations = [];
    for (const duration of service_detail.durations) {
      console.log('📝 [SERVICE] Processing duration:', JSON.stringify(duration, null, 2));
      const durationData = {
        business_id: service_detail.business_id,
        service_detail_id: createdServiceDetail.id,
        duration_minutes: duration.duration_minutes,
        price: duration.price,
        package_person: duration.package_person,
        package_amount: duration.package_amount
      };
      console.log('📝 [SERVICE] Duration data:', JSON.stringify(durationData, null, 2));

      const createdDuration = await BusinessServiceDuration.create(durationData, { transaction });
      console.log('✅ [SERVICE] BusinessServiceDuration created with ID:', createdDuration.id);
      createdDurations.push(createdDuration);
    }

    // 4. Create ClassSchedules and ClassScheduleInstructors
    console.log('🏗️ [SERVICE] Step 4: Creating ClassSchedules and ClassScheduleInstructors');
    const createdSchedules = [];
    for (const locationSchedule of location_schedules) {
      console.log('📝 [SERVICE] Processing location schedule:', JSON.stringify(locationSchedule, null, 2));
      const { location_id, schedules, price_override, package_person_override, package_amount_override } = locationSchedule;

      for (const schedule of schedules) {
        console.log('📝 [SERVICE] Processing schedule:', JSON.stringify(schedule, null, 2));
        const { day_of_week, start_time, end_time, instructor_ids } = schedule;

        // Use override values if provided, otherwise use default values from durations
        const defaultDuration = createdDurations[0]; // Use first duration as default
        const scheduleData = {
          class_id: createdClass.id,
          location_id,
          day_of_week,
          start_time,
          end_time,
          price: price_override !== undefined ? price_override : defaultDuration.price,
          package_amount: package_amount_override !== undefined ? package_amount_override : defaultDuration.package_amount,
          package_person: package_person_override !== undefined ? package_person_override : defaultDuration.package_person
        };
        console.log('📝 [SERVICE] Schedule data:', JSON.stringify(scheduleData, null, 2));

        const createdSchedule = await ClassSchedule.create(scheduleData, { transaction });
        console.log('✅ [SERVICE] ClassSchedule created with ID:', createdSchedule.id);

        // Create ClassScheduleInstructors
        console.log('📝 [SERVICE] Creating instructors for schedule:', createdSchedule.id);
        for (const instructor_id of instructor_ids) {
          console.log('📝 [SERVICE] Adding instructor:', instructor_id);
          await ClassScheduleInstructor.create({
            schedule_id: createdSchedule.id,
            instructor_id
          }, { transaction });
          console.log('✅ [SERVICE] ClassScheduleInstructor created');
        }

        createdSchedules.push(createdSchedule);
      }
    }

    // Commit the transaction
    console.log('🔄 [SERVICE] Committing transaction');
    await transaction.commit();
    console.log('✅ [SERVICE] Transaction committed successfully');

    // Return the complete result
    const result = {
      class: createdClass,
      service_detail: createdServiceDetail,
      durations: createdDurations,
      schedules: createdSchedules,
      total_schedules: createdSchedules.length,
      total_durations: createdDurations.length
    };
    
    console.log('✅ [SERVICE] Final result:', JSON.stringify(result, null, 2));
    return result;

  } catch (error) {
    // Rollback the transaction in case of error
    console.log('❌ [SERVICE] Error occurred, rolling back transaction');
    console.log('❌ [SERVICE] Error details:', error.message);
    console.log('❌ [SERVICE] Error stack:', error.stack);
    await transaction.rollback();
    console.log('🔄 [SERVICE] Transaction rolled back');
    throw error;
  }
};

exports.getClassesWithSchedules = async (query) => {
  console.log('🔍 [SERVICE] getClassesWithSchedules - Starting service');
  console.log('📦 [SERVICE] Query params:', JSON.stringify(query, null, 2));
  
  const {
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration,
    ClassSchedule,
    ClassScheduleInstructor,
    StaffProfile,
    Location,
    Category
  } = await getAllModels(process.env.DB_TYPE);

  console.log('✅ [SERVICE] Models loaded successfully');

  const {
    business_id,
    category_id,
    location_id,
    day_of_week,
    instructor_id,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = query;

  // Build where clause for BusinessService
  const whereClause = {
    is_class: true
  };

  if (business_id) {
    whereClause.business_id = business_id;
  }

  if (category_id) {
    whereClause.category_id = category_id;
  }

  console.log('📝 [SERVICE] Where clause:', JSON.stringify(whereClause, null, 2));

  // Build include clause for schedules
  const scheduleInclude = {
    model: ClassSchedule,
    as: 'schedules',
    include: [
      {
        model: ClassScheduleInstructor,
        as: 'instructors',
        include: [
          {
            model: StaffProfile,
            as: 'instructor',
            attributes: ['id', 'name', 'email', 'phone_number', 'profile_photo_url']
          }
        ]
      },
      {
        model: Location,
        as: 'Location',
        attributes: ['id', 'title', 'address', 'city', 'state', 'country']
      }
    ]
  };

  // Add location filter if provided
  if (location_id) {
    scheduleInclude.where = { location_id };
  }

  // Add day filter if provided
  if (day_of_week) {
    if (scheduleInclude.where) {
      scheduleInclude.where.day_of_week = day_of_week;
    } else {
      scheduleInclude.where = { day_of_week };
    }
  }

  // Add instructor filter if provided
  if (instructor_id) {
    if (scheduleInclude.where) {
      scheduleInclude.where['$instructors.instructor_id$'] = instructor_id;
    } else {
      scheduleInclude.where = { '$instructors.instructor_id$': instructor_id };
    }
  }

  console.log('📝 [SERVICE] Schedule include:', JSON.stringify(scheduleInclude, null, 2));

  // Build order clause
  let orderClause = [[sortBy, sortOrder]];
  
  // If filtering by day, order by time within that day
  if (day_of_week) {
    orderClause = [
      ['schedules', 'start_time', 'ASC']
    ];
  } else {
    // Default ordering for classes
    orderClause = [
      ['schedules', 'day_of_week', 'ASC'],
      ['schedules', 'start_time', 'ASC']
    ];
  }

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  console.log('📝 [SERVICE] Order clause:', JSON.stringify(orderClause, null, 2));
  console.log('📝 [SERVICE] Pagination - page:', page, 'limit:', limit, 'offset:', offset);

  // Fetch classes with pagination
  const result = await BusinessService.findAndCountAll({
    where: whereClause,
    include: [
      scheduleInclude,
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'description']
      },
      {
        model: BusinessServiceDetail,
        as: 'service_details',
        attributes: ['id', 'name', 'description'],
        required: false,
        include: [
          {
            model: BusinessServiceDuration,
            as: 'durations',
            attributes: ['id', 'duration_minutes', 'price', 'package_amount', 'package_person']
          }
        ]
      }
    ],
    order: orderClause,
    limit: parseInt(limit),
    offset: offset,
    distinct: true
  });

  console.log('✅ [SERVICE] Query completed, found', result.count, 'classes');

  // Transform the data to include only the required fields
  const transformedRows = result.rows.map(classItem => {
    const serviceDetail = classItem.service_details && classItem.service_details.length > 0 
      ? classItem.service_details[0] 
      : null;
    
    const serviceName = serviceDetail ? serviceDetail.name : null;
    const serviceDescription = serviceDetail ? serviceDetail.description : null;
    const durations = serviceDetail && serviceDetail.durations ? serviceDetail.durations : [];
    
    return {
      id: classItem.id,
      business_id: classItem.business_id,
      category_id: classItem.category_id,
      is_class: classItem.is_class,
      is_active: classItem.is_active,
      created_at: classItem.createdAt,
      updated_at: classItem.updatedAt,
      
      // Category information
      category: classItem.category ? {
        id: classItem.category.id,
        name: classItem.category.name,
        slug: classItem.category.slug,
        description: classItem.category.description
      } : null,
      
      // Service information
      service_name: serviceName,
      service_description: serviceDescription,
      durations: durations,
      
      // Schedules with locations and instructors
      schedules: classItem.schedules ? classItem.schedules.map(schedule => ({
        id: schedule.id,
        class_id: schedule.class_id,
        location_id: schedule.location_id,
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        price: schedule.price,
        package_amount: schedule.package_amount,
        package_person: schedule.package_person,
        created_at: schedule.createdAt,
        updated_at: schedule.updatedAt,
        
        // Location information
        location: schedule.Location ? {
          id: schedule.Location.id,
          title: schedule.Location.title,
          address: schedule.Location.address,
          city: schedule.Location.city,
          state: schedule.Location.state,
          country: schedule.Location.country
        } : null,
        
        // Instructor information
        instructors: schedule.instructors ? schedule.instructors.map(instructor => ({
          id: instructor.instructor.id,
          name: instructor.instructor.name,
          email: instructor.instructor.email,
          phone_number: instructor.instructor.phone_number,
          profile_photo_url: instructor.instructor.profile_photo_url
        })) : []
      })) : [],
      
      // Summary statistics
      total_schedules: classItem.schedules ? classItem.schedules.length : 0,
      total_instructors: classItem.schedules ? classItem.schedules.reduce((total, schedule) => 
        total + (schedule.instructors ? schedule.instructors.length : 0), 0) : 0,
      total_durations: durations.length
    };
  });

  const finalResult = {
    classes: transformedRows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: result.count,
      totalPages: Math.ceil(result.count / parseInt(limit))
    }
  };

  console.log('✅ [SERVICE] Final result:', JSON.stringify(finalResult, null, 2));
  return finalResult;
};

exports.getClassWithSchedulesById = async (classId) => {
  console.log('🔍 [SERVICE] getClassWithSchedulesById - Starting service');
  console.log('📦 [SERVICE] Class ID:', classId);
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(classId)) {
    console.log('❌ [SERVICE] Invalid UUID format:', classId);
    throw new Error('Invalid class ID format');
  }
  
  const {
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration,
    ClassSchedule,
    ClassScheduleInstructor,
    StaffProfile,
    Location,
    Category
  } = await getAllModels(process.env.DB_TYPE);

  console.log('✅ [SERVICE] Models loaded successfully');

  // Fetch the specific class with all related data
  const classItem = await BusinessService.findOne({
    where: {
      id: classId,
      is_class: true
    },
    include: [
      {
        model: ClassSchedule,
        as: 'schedules',
        include: [
          {
            model: ClassScheduleInstructor,
            as: 'instructors',
            include: [
              {
                model: StaffProfile,
                as: 'instructor',
                attributes: ['id', 'name', 'email', 'phone_number', 'profile_photo_url']
              }
            ]
          },
          {
            model: Location,
            as: 'Location',
            attributes: ['id', 'title', 'address', 'city', 'state', 'country']
          }
        ]
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'description']
      },
      {
        model: BusinessServiceDetail,
        as: 'service_details',
        attributes: ['id', 'name', 'description'],
        required: false,
        include: [
          {
            model: BusinessServiceDuration,
            as: 'durations',
            attributes: ['id', 'duration_minutes', 'price', 'package_amount', 'package_person']
          }
        ]
      }
    ]
  });

  if (!classItem) {
    console.log('❌ [SERVICE] Class not found with ID:', classId);
    throw new Error('Class not found');
  }

  console.log('✅ [SERVICE] Class found, transforming data');

  // Transform the data to include only the required fields
  const serviceDetail = classItem.service_details && classItem.service_details.length > 0 
    ? classItem.service_details[0] 
    : null;
  
  const serviceName = serviceDetail ? serviceDetail.name : null;
  const serviceDescription = serviceDetail ? serviceDetail.description : null;
  const durations = serviceDetail && serviceDetail.durations ? serviceDetail.durations : [];
  
  const transformedClass = {
    id: classItem.id,
    business_id: classItem.business_id,
    category_id: classItem.category_id,
    is_class: classItem.is_class,
    is_active: classItem.is_active,
    created_at: classItem.createdAt,
    updated_at: classItem.updatedAt,
    
    // Category information
    category: classItem.category ? {
      id: classItem.category.id,
      name: classItem.category.name,
      slug: classItem.category.slug,
      description: classItem.category.description
    } : null,
    
    // Service information
    service_name: serviceName,
    service_description: serviceDescription,
    durations: durations,
    
    // Schedules with locations and instructors
    schedules: classItem.schedules ? classItem.schedules.map(schedule => ({
      id: schedule.id,
      class_id: schedule.class_id,
      location_id: schedule.location_id,
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      price: schedule.price,
      package_amount: schedule.package_amount,
      package_person: schedule.package_person,
      created_at: schedule.createdAt,
      updated_at: schedule.updatedAt,
      
      // Location information
      location: schedule.Location ? {
        id: schedule.Location.id,
        title: schedule.Location.title,
        address: schedule.Location.address,
        city: schedule.Location.city,
        state: schedule.Location.state,
        country: schedule.Location.country
      } : null,
      
      // Instructor information
      instructors: schedule.instructors ? schedule.instructors.map(instructor => ({
        id: instructor.instructor.id,
        name: instructor.instructor.name,
        email: instructor.instructor.email,
        phone_number: instructor.instructor.phone_number,
        profile_photo_url: instructor.instructor.profile_photo_url
      })) : []
    })) : [],
    
    // Summary statistics
    total_schedules: classItem.schedules ? classItem.schedules.length : 0,
    total_instructors: classItem.schedules ? classItem.schedules.reduce((total, schedule) => 
      total + (schedule.instructors ? schedule.instructors.length : 0), 0) : 0,
    total_durations: durations.length
  };

  console.log('✅ [SERVICE] Final result:', JSON.stringify(transformedClass, null, 2));
  return transformedClass;
};

exports.unifiedClassWithSchedule = async (data) => {
  console.log('🔍 [SERVICE] unifiedClassWithSchedule - Starting service');
  console.log('📦 [SERVICE] Input data:', JSON.stringify(data, null, 2));
  
  const {
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration,
    ClassSchedule,
    ClassScheduleInstructor
  } = await getAllModels(process.env.DB_TYPE);

  console.log('✅ [SERVICE] Models loaded successfully');

  const { service_detail, location_schedules } = data;
  const isUpdate = !!data.id;
  
  console.log('📝 [SERVICE] Operation type:', isUpdate ? 'UPDATE' : 'CREATE');
  console.log('📋 [SERVICE] Extracted service_detail and location_schedules');

  const transaction = await BusinessService.sequelize.transaction();
  console.log('🔄 [SERVICE] Transaction started');

  try {
    let createdClass;
    
    if (isUpdate) {
      // Update existing class
      console.log('🔄 [SERVICE] Step 1: Updating existing BusinessService');
      
      // Check if class exists
      const existingClass = await BusinessService.findOne({
        where: { id: data.id, is_class: true }
      });
      
      if (!existingClass) {
        console.log('❌ [SERVICE] Class not found for update:', data.id);
        throw new Error('Class not found');
      }
      
      // Update the class
      await BusinessService.update({
        business_id: service_detail.business_id,
        category_id: service_detail.category_id,
        is_class: service_detail.is_class,
        is_active: service_detail.is_active !== undefined ? service_detail.is_active : true
      }, {
        where: { id: data.id },
        transaction
      });
      
      createdClass = await BusinessService.findByPk(data.id, { transaction });
      console.log('✅ [SERVICE] BusinessService updated with ID:', createdClass.id);
      
      // Delete existing related data for clean update
      console.log('🗑️ [SERVICE] Cleaning existing related data');
      
      // Get existing service details to delete durations
      const existingServiceDetails = await BusinessServiceDetail.findAll({
        where: { service_id: data.id },
        transaction
      });
      
      for (const serviceDetail of existingServiceDetails) {
        await BusinessServiceDuration.destroy({
          where: { service_detail_id: serviceDetail.id },
          transaction
        });
      }
      
      await BusinessServiceDetail.destroy({
        where: { service_id: data.id },
        transaction
      });
      
      await ClassSchedule.destroy({
        where: { class_id: data.id },
        transaction
      });
      
    } else {
      // Create new class
      console.log('🏗️ [SERVICE] Step 1: Checking if BusinessService exists');
      const classData = {
        business_id: service_detail.business_id,
        category_id: service_detail.category_id,
        is_class: service_detail.is_class,
        is_active: service_detail.is_active !== undefined ? service_detail.is_active : true
      };
      console.log('📝 [SERVICE] Class data:', JSON.stringify(classData, null, 2));

      createdClass = await BusinessService.findOne({
        where: {
          business_id: service_detail.business_id,
          category_id: service_detail.category_id,
          is_class: service_detail.is_class
        }
      });

      if (createdClass) {
        console.log('✅ [SERVICE] BusinessService already exists with ID:', createdClass.id);
      } else {
        console.log('🏗️ [SERVICE] Creating new BusinessService');
        createdClass = await BusinessService.create(classData, { transaction });
        console.log('✅ [SERVICE] BusinessService created with ID:', createdClass.id);
      }
    }

    // 2. Create the BusinessServiceDetail
    console.log('🏗️ [SERVICE] Step 2: Creating BusinessServiceDetail');
    const serviceDetailData = {
      business_id: service_detail.business_id,
      service_id: createdClass.id,
      name: service_detail.name,
      description: service_detail.description || ''
    };
    console.log('📝 [SERVICE] Service detail data:', JSON.stringify(serviceDetailData, null, 2));

    const createdServiceDetail = await BusinessServiceDetail.create(serviceDetailData, { transaction });
    console.log('✅ [SERVICE] BusinessServiceDetail created with ID:', createdServiceDetail.id);

    // 3. Create the BusinessServiceDurations
    console.log('🏗️ [SERVICE] Step 3: Creating BusinessServiceDurations');
    const createdDurations = [];
    for (const duration of service_detail.durations) {
      console.log('📝 [SERVICE] Processing duration:', JSON.stringify(duration, null, 2));
      const durationData = {
        business_id: service_detail.business_id,
        service_detail_id: createdServiceDetail.id,
        duration_minutes: duration.duration_minutes,
        price: duration.price,
        package_person: duration.package_person,
        package_amount: duration.package_amount
      };
      console.log('📝 [SERVICE] Duration data:', JSON.stringify(durationData, null, 2));

      const createdDuration = await BusinessServiceDuration.create(durationData, { transaction });
      console.log('✅ [SERVICE] BusinessServiceDuration created with ID:', createdDuration.id);
      createdDurations.push(createdDuration);
    }

    // 4. Create ClassSchedules and ClassScheduleInstructors
    console.log('🏗️ [SERVICE] Step 4: Creating ClassSchedules and ClassScheduleInstructors');
    const createdSchedules = [];
    for (const locationSchedule of location_schedules) {
      console.log('📝 [SERVICE] Processing location schedule:', JSON.stringify(locationSchedule, null, 2));
      const { location_id, schedules, price_override, package_person_override, package_amount_override } = locationSchedule;

      for (const schedule of schedules) {
        console.log('📝 [SERVICE] Processing schedule:', JSON.stringify(schedule, null, 2));
        const { day_of_week, start_time, end_time, instructor_ids } = schedule;

        const defaultDuration = createdDurations[0];
        const scheduleData = {
          class_id: createdClass.id,
          location_id,
          day_of_week,
          start_time,
          end_time,
          price: price_override !== undefined ? price_override : defaultDuration.price,
          package_amount: package_amount_override !== undefined ? package_amount_override : defaultDuration.package_amount,
          package_person: package_person_override !== undefined ? package_person_override : defaultDuration.package_person
        };
        console.log('📝 [SERVICE] Schedule data:', JSON.stringify(scheduleData, null, 2));

        const createdSchedule = await ClassSchedule.create(scheduleData, { transaction });
        console.log('✅ [SERVICE] ClassSchedule created with ID:', createdSchedule.id);

        console.log('📝 [SERVICE] Creating instructors for schedule:', createdSchedule.id);
        for (const instructor_id of instructor_ids) {
          console.log('📝 [SERVICE] Adding instructor:', instructor_id);
          await ClassScheduleInstructor.create({
            schedule_id: createdSchedule.id,
            instructor_id
          }, { transaction });
          console.log('✅ [SERVICE] ClassScheduleInstructor created');
        }
        createdSchedules.push(createdSchedule);
      }
    }

    console.log('🔄 [SERVICE] Committing transaction');
    await transaction.commit();
    console.log('✅ [SERVICE] Transaction committed successfully');

    const result = {
      class: createdClass,
      service_detail: createdServiceDetail,
      durations: createdDurations,
      schedules: createdSchedules,
      total_schedules: createdSchedules.length,
      total_durations: createdDurations.length
    };

    console.log('✅ [SERVICE] Final result:', JSON.stringify(result, null, 2));
    return result;

  } catch (error) {
    console.log('❌ [SERVICE] Error occurred, rolling back transaction');
    console.log('❌ [SERVICE] Error details:', error.message);
    console.log('❌ [SERVICE] Error stack:', error.stack);
    await transaction.rollback();
    console.log('🔄 [SERVICE] Transaction rolled back');
    throw error;
  }
};
