exports.createLocation = [
  { key: 'title', type: 'string', required: true },
  { key: 'address', type: 'string', required: true },
  { key: 'city', type: 'string', required: true },
  { key: 'state', type: 'string', required: false },
  { key: 'country', type: 'string', required: true },
  { key: 'latitude', type: 'float', required: false },
  { key: 'longitude', type: 'float', required: false },
  { key: 'is_active', type: 'boolean', required: false }
];

exports.updateLocation = [
  { key: 'title', type: 'string', required: false },
  { key: 'address', type: 'string', required: false },
  { key: 'city', type: 'string', required: false },
  { key: 'state', type: 'string', required: false },
  { key: 'country', type: 'string', required: false },
  { key: 'latitude', type: 'float', required: false },
  { key: 'longitude', type: 'float', required: false },
  { key: 'is_active', type: 'boolean', required: false }
];
