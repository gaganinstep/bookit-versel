exports.createDuration = [
  { key: 'location_id', type: 'uuid', required: true },
  { key: 'duration_minutes', type: 'number', required: true },
  { key: 'price', type: 'float', required: true },
  { key: 'is_active', type: 'boolean', required: false }
];

exports.updateDuration = [
  { key: 'location_id', type: 'uuid', required: false },
  { key: 'duration_minutes', type: 'number', required: false },
  { key: 'price', type: 'float', required: false },
  { key: 'is_active', type: 'boolean', required: false }
];
