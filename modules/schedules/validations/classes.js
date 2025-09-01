const Joi = require('joi');

exports.createClass = Joi.object({
  business_id: Joi.string().uuid().required(),
  location_schedules: Joi.array().items(
    Joi.object({
      location_id: Joi.string().uuid().required(),
      price: Joi.number().optional(),
      package_amount: Joi.number().optional(),
      package_person: Joi.number().optional(),
      schedule: Joi.array().items(
        Joi.object({
          day: Joi.string().required(),
          start_time: Joi.string().required(),  // Format: "HH:mm"
          end_time: Joi.string().required(),
          instructors: Joi.array().items(Joi.string().uuid()).required()
        })
      ).required()
    })
  ).required(),
  class_id: Joi.string().uuid().required()
});

exports.createClassWithSchedule = [
  {
    key: 'service_detail',
    type: 'object',
    required: true,
    fields: [
      { key: 'business_id', type: 'uuid', required: true },
      { key: 'name', type: 'string', required: true },
      { key: 'description', type: 'string', required: false },
      { key: 'is_class', type: 'boolean', required: true },
      { key: 'is_archived', type: 'boolean', required: false },
      { key: 'tags', type: 'array', required: false },
      { key: 'media_url', type: 'string', required: false },
      { key: 'limit_on_spots', type: 'boolean', required: false },
      { key: 'spot_limit', type: 'number', required: false },
      { key: 'durations', type: 'array', required: true, items: [
        { key: 'duration_minutes', type: 'number', required: true },
        { key: 'price', type: 'number', required: true },
        { key: 'package_person', type: 'number', required: false },
        { key: 'package_amount', type: 'number', required: false }
      ]},
      { key: 'category_id', type: 'uuid', required: true },
      { key: 'title', type: 'string', required: false },
      { key: 'parent_id', type: 'uuid', required: false },
      { key: 'is_active', type: 'boolean', required: false },
      { key: 'category_level', type: 'number', required: false },
      { key: 'category_level_0_id', type: 'uuid', required: false },
      { key: 'category_level_1_id', type: 'uuid', required: false },
      { key: 'category_level_2_id', type: 'uuid', required: false }
    ]
  },
  {
    key: 'location_schedules',
    type: 'array',
    required: true,
    items: [
      { key: 'location_id', type: 'uuid', required: true },
      { key: 'class_available', type: 'boolean', required: false },
      { key: 'schedules', type: 'array', required: true, items: [
        { key: 'day_of_week', type: 'string', required: true },
        { key: 'start_time', type: 'time', required: true },
        { key: 'end_time', type: 'time', required: true },
        { key: 'instructor_ids', type: 'array', required: true }
      ]},
      { key: 'price_override', type: 'number', required: false },
      { key: 'package_person_override', type: 'number', required: false },
      { key: 'package_amount_override', type: 'number', required: false }
    ]
  }
];

exports.unifiedClassWithSchedule = [
  { key: 'id', type: 'uuid', required: false }, // Optional ID for update operations
  {
    key: 'service_detail',
    type: 'object',
    required: true,
    fields: [
      { key: 'business_id', type: 'uuid', required: true },
      { key: 'name', type: 'string', required: true },
      { key: 'description', type: 'string', required: false },
      { key: 'is_class', type: 'boolean', required: true },
      { key: 'is_archived', type: 'boolean', required: false },
      { key: 'tags', type: 'array', required: false },
      { key: 'media_url', type: 'string', required: false },
      { key: 'limit_on_spots', type: 'boolean', required: false },
      { key: 'spot_limit', type: 'number', required: false },
      { key: 'durations', type: 'array', required: true, items: [
        { key: 'duration_minutes', type: 'number', required: true },
        { key: 'price', type: 'number', required: true },
        { key: 'package_person', type: 'number', required: false },
        { key: 'package_amount', type: 'number', required: false }
      ]},
      { key: 'category_id', type: 'uuid', required: true },
      { key: 'title', type: 'string', required: false },
      { key: 'parent_id', type: 'uuid', required: false },
      { key: 'is_active', type: 'boolean', required: false },
      { key: 'category_level', type: 'number', required: false },
      { key: 'category_level_0_id', type: 'uuid', required: false },
      { key: 'category_level_1_id', type: 'uuid', required: false },
      { key: 'category_level_2_id', type: 'uuid', required: false }
    ]
  },
  {
    key: 'location_schedules',
    type: 'array',
    required: true,
    items: [
      { key: 'location_id', type: 'uuid', required: true },
      { key: 'class_available', type: 'boolean', required: false },
      { key: 'schedules', type: 'array', required: true, items: [
        { key: 'day_of_week', type: 'string', required: true },
        { key: 'start_time', type: 'time', required: true },
        { key: 'end_time', type: 'time', required: true },
        { key: 'instructor_ids', type: 'array', required: true }
      ]},
      { key: 'price_override', type: 'number', required: false },
      { key: 'package_person_override', type: 'number', required: false },
      { key: 'package_amount_override', type: 'number', required: false }
    ]
  }
];

exports.updateClass = [
  { key: 'id', type: 'uuid', required: true },
  { key: 'business_id', type: 'uuid', required: false },
  { key: 'staff_profile_id', type: 'uuid', required: false },
  { key: 'location_id', type: 'uuid', required: false },
  { key: 'start_time', type: 'time', required: false },
  { key: 'end_time', type: 'time', required: false },
  { key: 'capacity', type: 'number', required: false },
  { key: 'meeting_link', type: 'string', required: false },
  { key: 'status', type: 'string', required: false }
];
