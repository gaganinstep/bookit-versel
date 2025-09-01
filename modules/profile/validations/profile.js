exports.createStaffProfile = [
  { key: 'id', type: 'uuid', required: false },
  { key: 'user_id', type: 'uuid', required: false },
  { key: 'business_id', type: 'uuid', required: false },
  { key: 'category_id', type: 'array', required: true, items: 'uuid' }, // ✅ updated
  { key: 'location_id', type: 'array', required: false, items: 'uuid' },
  { key: 'name', type: 'string', required: true },
  { key: 'email', type: 'string', required: true },
  { key: 'phone_number', type: 'string', required: true },
  { key: 'gender', type: 'string', required: true },
  { key: 'profile_photo_url', type: 'string', required: false },
  { key: 'is_available', type: 'boolean', required: false },
  { key: 'for_class', type: 'boolean', required: false }
];

exports.createOrUpdateStaffWithSchedule = [
  { key: 'id', type: 'uuid', required: false }, // For update operations
  { key: 'user_id', type: 'uuid', required: false },
  { key: 'business_id', type: 'uuid', required: false },
  { key: 'category_id', type: 'array', required: true, items: 'uuid' },
  { key: 'location_id', type: 'array', required: false, items: 'uuid' },
  { key: 'name', type: 'string', required: true },
  { key: 'email', type: 'string', required: true },
  { key: 'phone_number', type: 'string', required: true },
  { key: 'gender', type: 'string', required: true },
  { key: 'profile_photo_url', type: 'string', required: false },
  { key: 'is_available', type: 'boolean', required: false },
  { key: 'for_class', type: 'boolean', required: false },
  { key: 'schedules', type: 'object', required: false } // Optional schedules object
];

exports.unifiedStaffWithSchedule = [
  { key: 'id', type: 'uuid', required: false }, // For update operations - can be null/empty for create
  { key: 'user_id', type: 'uuid', required: false }, // Made optional
  { key: 'business_id', type: 'uuid', required: false },
  { key: 'category_id', type: 'array', required: true, items: 'uuid' },
  { key: 'location_id', type: 'array', required: false, items: 'uuid' },
  { key: 'name', type: 'string', required: true },
  { key: 'email', type: 'string', required: true },
  { key: 'phone_number', type: 'string', required: true },
  { key: 'gender', type: 'string', required: true },
  { key: 'profile_photo_url', type: 'string', required: false },
  { key: 'is_available', type: 'boolean', required: false },
  { key: 'for_class', type: 'boolean', required: false },
  { key: 'schedules', type: 'object', required: false } // Optional schedules object
];
