exports.createOrUpdateHour = [
  { key: 'day_of_week', type: 'string', required: true }, // Mon–Sun
  { key: 'open_time', type: 'time', required: true },
  { key: 'close_time', type: 'time', required: true }
];
