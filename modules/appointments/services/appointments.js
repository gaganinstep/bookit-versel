const { getAllModels } = require('../../../middlewares/loadModels');
const { Op, fn, col, where } = require('sequelize');

exports.create = async (appointments) => {
  const { Appointment } = await getAllModels(process.env.DB_TYPE);

  const results = [];

  for (const data of appointments) {
    const whereCondition = {
      user_id: data.user_id,
      business_id: data.business_id,
      location_id: data.location_id,
      booked_by: data.booked_by,
      start_from: data.start_from,
      end_at: data.end_at,
      business_service_id: data.business_service_id
    };

    const existing = await Appointment.findOne({ where: whereCondition });

    if (existing) {
      await existing.update(data);
      results.push({ ...existing.toJSON(), action: 'updated' });
    } else {
      const created = await Appointment.create(data);
      results.push({ ...created.toJSON(), action: 'created' });
    }
  }

  return results;
};


exports.list = async (query, user_id) => {
  const { 
    Appointment, 
    Class, 
    User, 
    BusinessService, 
    BusinessServiceDetail,
    BusinessServiceDuration,
    Business,
    Location,
    StaffProfile,
    Service,
    Category
  } = await getAllModels(process.env.DB_TYPE); 

  const { business_id, class_id, status, limit = 10, offset = 0 } = query;

  const where = {};

if (user_id) {
  where[Op.or] = [
    { user_id },
    { booked_by: user_id }
  ];
}
  if (business_id) where.business_id = business_id;
  if (class_id) where.class_id = class_id;
  if (status) where.status = status;
  
  return await Appointment.findAndCountAll({
    where,
    attributes:["id","rescheduled_from","status","start_from","end_at","date","status_reason","is_cancelled","createdAt"],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "booker",
        attributes: ["id", "full_name", "email", "phone", "preferred_language"],
      },
      {
        model: Location,
        as: 'location_details',
        attributes: ["id", "title", "address", "floor", "city", "state", "country", "is_active"]
      },
      {
        model: Business,
        as: "business",
        attributes: ["id", "name", "website", "logo_url", "is_active", "timezone"],
      },
      {
        model: Class,
        as: "class",
        attributes: ["id", "status", "meeting_link", "capacity","start_time", "end_time"],
        include: [
          {
            model: Service,
            as: 'service_details',
            attributes: ["id", "image_url", "is_active"],
          }, 
        ]
      },
      {
        model: BusinessService,
        as: "business_service",
        attributes: ["id", "is_active","is_class"],
        include: [
          {
            model: BusinessServiceDetail,
            as: "service_details",
            attributes: ["id", "service_id", "name", "description"],
            include: [
              {
                model: BusinessServiceDuration,
                attributes: ["id", "duration_minutes", "price", "package_amount", "package_person"],
                as: 'durations', 
              },
            ],
          },
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "slug", "description","is_active","level",],
          },
        ],
      },
      {
        model: StaffProfile,
        as: "staff_member",
        attributes: ["id", "name", "email","phone_number", "profile_photo_url","gender"],
      }
    ],
  });
};

exports.getTodaysAppointmentsByLocation = async (location_id) => {
  const { 
    StaffProfile,
    Appointment,
    User,
    BusinessService,
    Category,
    BusinessServiceDetail,
    BusinessServiceDuration
  } = await getAllModels(process.env.DB_TYPE);
const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Kolkata" });

  const staffList = await StaffProfile.findAll({
    where: {
      location_id: {
        [Op.contains]: [location_id],
      },
    },
    attributes: ["id", "name"],
    raw: true,
  });

  const staffIds = staffList.map((s) => s.id);
  if (staffIds.length === 0) return [];

  const appointments = await Appointment.findAll({
    where: {
      practitioner: {
        [Op.in]: staffIds,
      },
      location_id: location_id,
      // [Op.and]: [
      //   where(fn("DATE", col("date")), getFormattedUTCDateTime()), 
      // ],
    },
    include: [
      {
        model: User,
        as: "booker",
        attributes: ["full_name"],
      },
      {
        model: BusinessService,
        as: "business_service",
        attributes: ["id", "is_class"],
        include: [
          {
            model: BusinessServiceDetail,
            as: "service_details",
            attributes: ["id", "name"],
            include: [
              {
                model: BusinessServiceDuration,
                as: "durations",
                attributes: ["duration_minutes"],
              },
            ],
          },
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
        ],
      },
    ],
    attributes: [
      "practitioner",
      "start_from",
      "status",
      "is_cancelled",
      "date",
    ],
    raw: true,
    nest: true,
  });
 
  const staffMap = new Map();
  staffList.forEach((staff) => {
    staffMap.set(staff.id, {
      staff_id: staff.id,
      staff_name: staff.name,
      appointments: [],
    });
  });

  for (const appt of appointments) {
    const staffId = appt.practitioner;
    if (!staffMap.has(staffId)) continue;
      
    console.log('appt:---', appt);
    
    const duration = appt.business_service?.service_details?.durations?.duration_minutes;
    const serviceName = appt.business_service?.service_details?.name || "";
    const clientName = appt.booker?.full_name || "";

    staffMap.get(staffId).appointments.push({
      start_time: appt.date,
      duration_minutes: duration,
      service_name: serviceName,
      client_name: clientName,
      status: appt.status,
      is_cancelled: appt.is_cancelled,
      is_class: appt?.business_service?.is_class,
    });
  }

  return Array.from(staffMap.values());
};


exports.getById = async (id) => {
  const {
    Appointment,
    User,
    Class,
    Business,
    BusinessService,
    BusinessServiceDetail,
    BusinessServiceDuration,
    StaffProfile,
    Location,
    Category
  } = await getAllModels(process.env.DB_TYPE);

  const appointment = await Appointment.findByPk(id, {
    include: [
  {
    model: User,
    as: 'user',
    attributes: ['id', 'full_name', 'email', 'phone'],
  },
  {
    model: User,
    as: 'booker',
    attributes: ['id', 'full_name', 'email'],
  },
  {
    model: Class,
    as: 'class',
    attributes: ['id', 'start_time', 'end_time', 'status', 'staff_profile_id'],
    include: [
      {
        model: StaffProfile,
        attributes: ['id', 'name', 'email', 'profile_photo_url'],
      },
    ],
  },
  {
    model: Business,
    as: 'business',
    attributes: ['id', 'name', 'logo_url'],
    include: [
      {
        model: Location,
        as: 'locations',
        attributes: ['id', 'title'],
      },
    ],
  },
  {
    model: BusinessService,
    as: 'business_service',
    attributes: ['id', 'is_active'],
    include: [
      {
        model: BusinessServiceDetail,
        as: 'service_details',
        attributes: ['id', 'name', 'description'],
        include: [
          {
            model: BusinessServiceDuration,
            as: 'durations',
            attributes: ['duration_minutes', 'price'],
          },
        ],
      },
      {
        model: Category,
        as: 'category',
        attributes: ['name'],
      },
    ],
  },
  {
    model: Appointment,
    as: 'previousAppointment',
    attributes: ['id', 'status', 'status_reason'],
  },
]

  });

  return appointment ? appointment.toJSON() : null;
};


exports.rescheduledAppointment = async (id, data) => {
  const { Appointment } = await getAllModels(process.env.DB_TYPE);

  if (data.rescheduled_from) {
    const prevAppointment = await Appointment.findByPk(data.rescheduled_from);

    if (!prevAppointment) {
      throw new Error("Previous appointment not found");
    }

    const newAppointmentData = {
      business_id: data.business_id ?? prevAppointment.business_id,
      location_id: data.location_id ?? prevAppointment.location_id,
      booked_by: data.booked_by ?? prevAppointment.booked_by,
      business_service_id: data.business_service_id ?? prevAppointment.business_service_id,
      rescheduled_from: prevAppointment.id,
      status: "rescheduled",
      status_reason: data.status_reason ?? null,
      class_id: data.class_id ?? prevAppointment.class_id,
      practitioner: data.practitioner ?? prevAppointment.practitioner,
      start_from: data.start_from ?? prevAppointment.start_from,
      end_at: data.end_at ?? prevAppointment.end_at,
      date: data.date ?? prevAppointment.date,
      is_cancelled: false,
    };

    const newAppointment = await Appointment.create(newAppointmentData);
    return newAppointment;
  }

  await Appointment.update(data, { where: { id } });
  return await Appointment.findByPk(id);
};

exports.delete = async (id) => {
  const { Appointment } = await getAllModels(process.env.DB_TYPE);
  return await Appointment.update({ status: 'cancelled' }, { where: { id } });
};


exports.cancelAppointment = async (id, status_reason) => {
  const { Appointment } = await getAllModels(process.env.DB_TYPE);

  const updateData = {
    is_cancelled: true,
    status: "cancelled"
  };


  if (status_reason) {
    updateData.status_reason = status_reason;
  }

  await Appointment.update(updateData, { where: { id } });
  return await Appointment.findByPk(id);
};


