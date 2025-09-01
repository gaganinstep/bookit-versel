exports.createNotification = [
  { key: 'user_id', type: 'uuid', required: true },
  { key: 'channel', type: 'string', required: true },
  { key: 'language_code', type: 'string', required: true },
  { key: 'title', type: 'string', required: true },
  { key: 'message', type: 'string', required: true }
];
