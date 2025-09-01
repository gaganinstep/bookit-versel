exports.create = [
  { key: 'staff_profile_id', type: 'uuid', required: true },
  { key: 'location_id', type: 'uuid', required: true },
  { key: 'weekday', type: 'number', required: true },
  { key: 'start_time', type: 'time', required: true },
  { key: 'end_time', type: 'time', required: true }
];

exports.update = [
  { key: 'id', type: 'uuid', required: false },
  { key: 'location_id', type: 'uuid', required: false },
  { key: 'weekday', type: 'number', required: false },
  { key: 'start_time', type: 'time', required: false },
  { key: 'end_time', type: 'time', required: false }
];
