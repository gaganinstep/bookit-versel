exports.createOrUpdate = [
  { key: 'id', type: 'uuid', required: false },
  { key: 'service_id', type: 'uuid', required: false },
  { key: 'language_code', type: 'string', required: true },
  { key: 'title', type: 'string', required: true },
  { key: 'description', type: 'string', required: false }
];
