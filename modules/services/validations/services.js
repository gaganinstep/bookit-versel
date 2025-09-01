exports.createService = [
  { key: 'business_id', type: 'uuid', required: true },
  { key: 'category_id', type: 'uuid', required: true },
  { key: 'is_class', type: 'boolean', required: true },
  { key: 'image_url', type: 'string', required: false },
  { key: 'is_active', type: 'boolean', required: false }
];

exports.updateService = [
  { key: 'business_id', type: 'uuid', required: false },
  { key: 'category_id', type: 'uuid', required: false },
  { key: 'is_class', type: 'boolean', required: false },
  { key: 'image_url', type: 'string', required: false },
  { key: 'is_active', type: 'boolean', required: false }
];
