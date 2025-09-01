exports.createBusiness = [
  { key: 'name', type: 'string', required: true },
  { key: 'user_id', type: 'uuid', required: true },
  { key: 'email', type: 'string', required: true },
  { key: 'phone', type: 'string', required: true },
  { key: 'website', type: 'string', required: false },
  { key: 'user_slug', type: 'string', required: true },
  { key: 'slug', type: 'string', required: false },
  { key: 'logo_url', type: 'string', required: false },
  { key: 'cover_image_url', type: 'string', required: false },
  { key: 'timezone', type: 'string', required: true },
  { key: 'is_active', type: 'boolean', required: false },
  { key: 'is_onboarding_complete', type: 'boolean', required: false },
  { key: 'active_step', type: 'string', required: false },
];

exports.updateBusiness = [
  { key: 'name', type: 'string', required: false },
  { key: 'email', type: 'string', required: false },
  { key: 'phone', type: 'string', required: false },
  { key: 'user_slug', type: 'string', required: false },
  { key: 'website', type: 'string', required: false },
  { key: 'slug', type: 'string', required: false },
  { key: 'logo_url', type: 'string', required: false },
  { key: 'cover_image_url', type: 'string', required: false },
  { key: 'timezone', type: 'string', required: false },
  { key: 'active_step', type: 'string', required: false },
];
