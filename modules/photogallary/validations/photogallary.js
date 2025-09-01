exports.uploadPhoto = [
  { key: 'created_by', type: 'uuid', required: true },
  { key: 'business_id', type: 'uuid', required: true },
  { key: 'photos', type: 'string', required: false },
  { key: 'is_visible', type: 'boolean', required: false }
]