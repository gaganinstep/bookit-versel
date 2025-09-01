exports.createAppointment = [
  { key: 'user_id', type: 'uuid', required: true },
  { key: 'business_id', type: 'uuid', required: true },
  { key: 'location_id', type: 'uuid', required: true },
  { key: 'booked_by', type: 'uuid', required: true },
  { key: 'business_service_id', type: 'uuid', required: true  },
  { key: 'rescheduled_from', type: 'uuid', required: false },
  { key: 'status', type: 'string', required: true },
  { key: 'status_reason', type: 'string', required: false },
  { key: 'class_id', type: 'uuid', required: false },
  { key: 'practitioner', type: 'uuid', required: true },
  { key: 'start_from', type: 'time', required: true },
  { key: 'end_at', type: 'time', required: true },
  { key: 'date', type: 'datetime_utc', required: true },
  { key: 'is_cancelled', type: 'boolean', required: false },
];

exports.updateAppointment = [
  { key: 'booked_by', type: 'uuid', required: false },
  { key: 'rescheduled_from', type: 'uuid', required: true },
  { key: 'status', type: 'string', required: false },
  { key: 'status_reason', type: 'string', required: false },
  { key: 'practitioner', type: 'uuid', required: false },
  { key: 'start_from', type: 'time', required: false },
  { key: 'end_at', type: 'time', required: false },
  { key: 'date', type: 'datetime_utc', required: false },
  { key: 'is_cancelled', type: 'boolean', required: false },
];

exports.cancelAppointment = [ 
  { key: 'status_reason', type: 'string', required: false }, 
];
