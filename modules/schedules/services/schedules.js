const { getAllModels } = require("../../../middlewares/loadModels");

exports.create = async (class_id, data) => {
    const { ClassSchedule, ClassScheduleInstructor } = await getAllModels(process.env.DB_TYPE);
    
    // If ID is provided, update existing record
    if (data.id) {
        const existingSchedule = await ClassSchedule.findByPk(data.id);
        if (!existingSchedule) {
            throw new Error('Schedule not found');
        }
        
        // Update the schedule
        await ClassSchedule.update(data, { where: { id: data.id } });
        
        // Update instructors if provided
        if (data.instructors && Array.isArray(data.instructors)) {
            // Remove existing instructors
            await ClassScheduleInstructor.destroy({ where: { schedule_id: data.id } });
            
            // Add new instructors
            const instructorData = data.instructors.map(instructor_id => ({
                schedule_id: data.id,
                instructor_id: instructor_id
            }));
            await ClassScheduleInstructor.bulkCreate(instructorData);
        }
        
        return await ClassSchedule.findByPk(data.id);
    } else {
        // Create new schedule
        const schedule = await ClassSchedule.create({ ...data, class_id });
        
        // Add instructors if provided
        if (data.instructors && Array.isArray(data.instructors)) {
            const instructorData = data.instructors.map(instructor_id => ({
                schedule_id: schedule.id,
                instructor_id: instructor_id
            }));
            await ClassScheduleInstructor.bulkCreate(instructorData);
        }
        
        return schedule;
    }
};

exports.list = async (class_id) => {
    const { 
      ClassSchedule, 
      ClassScheduleInstructor, 
      Location, 
      BusinessService,
      StaffProfile 
    } = await getAllModels(process.env.DB_TYPE);
    
  const schedules = await ClassSchedule.findAll({ 
    where: { class_id },
    attributes: ['id', 'class_id', 'location_id', 'day_of_week', 'start_time', 'end_time', 'price', 'package_amount', 'package_person', 'createdAt', 'updatedAt'],
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
      },
      {
        model: BusinessService,
        as: 'classService',
        attributes: ['id', 'business_id', 'category_id', 'is_class', 'is_active']
      }
    ],
    order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
  });

  // Transform the data to the requested format
  if (schedules.length === 0) {
    return {
      business_id: null,
      class_id: class_id,
      location_schedules: []
    };
  }

  // Get business_id from the first schedule
  const business_id = schedules[0].classService?.business_id || null;
  
  // Group schedules by location
  const locationGroups = {};
  
  schedules.forEach(schedule => {
    const location_id = schedule.location_id;
    
    if (!locationGroups[location_id]) {
      locationGroups[location_id] = {
        id: schedule.id, // Add schedule ID at location_schedules level
        location_id: location_id,
        price: schedule.price,
        package_amount: schedule.package_amount,
        package_person: schedule.package_person,
        schedule: []
      };
    }
    
    // Extract instructor IDs
    const instructors = schedule.instructors?.map(inst => inst.instructor_id) || [];
    
    // Debug: Log the schedule ID and full schedule object
    console.log('Schedule ID:', schedule.id);
    console.log('Full schedule object:', JSON.stringify(schedule, null, 2));
    
    locationGroups[location_id].schedule.push({
      day: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      instructors: instructors
    });
  });

  return {
    business_id: business_id,
    class_id: class_id,
    location_schedules: Object.values(locationGroups)
  };
};

exports.listByBusiness = async (class_id) => {
    const { 
      ClassSchedule, 
      ClassScheduleInstructor, 
      Location, 
      BusinessService,
      StaffProfile 
    } = await getAllModels(process.env.DB_TYPE);
    
  return await ClassSchedule.findAll({ 
    where: { class_id },
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
      },
      {
        model: BusinessService,
        as: 'classService',
        attributes: ['id', 'business_id', 'category_id', 'is_class', 'is_active']
      }
    ],
    order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
  });
};

exports.update = async (id, data) => {
    const { ClassSchedule } = await getAllModels(process.env.DB_TYPE);
  return await ClassSchedule.update(data, { where: { id } });
};

exports.delete = async (id) => {
    const { ClassSchedule } = await getAllModels(process.env.DB_TYPE);
  return await ClassSchedule.destroy({ where: { id } });
};
