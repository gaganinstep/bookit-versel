exports.createSchedule = [
  { key: 'id', type: 'string', required: false }, // Optional ID for updates
  { key: 'day_of_week', type: 'string', required: true }, 
  { key: 'start_time', type: 'time', required: true },
  { key: 'end_time', type: 'time', required: true },
  { key: 'location_id', type: 'string', required: true },
  { key: 'price', type: 'number', required: false },
  { key: 'package_amount', type: 'number', required: false },
  { key: 'package_person', type: 'number', required: false },
  { key: 'instructors', type: 'array', required: false }
];

exports.updateSchedule = [
  { key: 'day_of_week', type: 'string', required: false },
  { key: 'start_time', type: 'time', required: false },
  { key: 'end_time', type: 'time', required: false },
  { key: 'location_id', type: 'string', required: false },
  { key: 'price', type: 'number', required: false },
  { key: 'package_amount', type: 'number', required: false },
  { key: 'package_person', type: 'number', required: false },
  { key: 'instructors', type: 'array', required: false }
];
