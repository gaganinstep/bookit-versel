const Joi = require('joi');

exports.createTranslation = [
  { key: 'language_code', type: 'string', required: true },
  { key: 'name', type: 'string', required: true },
  { key: 'description', type: 'string', required: false }
];

exports.updateBusiness = [
  {
    key: "step",
    type: "string",
    required: true,
    enum: ["locations"], // optional: restrict valid steps
  },
  {
    key: "data",
    type: "object",
    required: true,
    fields: [
      {
        key: "business_id",
        type: "uuid",
        required: true,
      },
      {
        key: "locations",
        type: "array",
        required: true,
        items: [
          {
            key: "title",
            type: "string",
            required: true,
          },
          {
            key: "address",
            type: "string",
            required: true,
          },
          {
            key: "city",
            type: "string",
            required: true,
          },
          {
            key: "state",
            type: "string",
            required: true,
          },
          {
            key: "country",
            type: "string",
            required: true,
          },
          {
            key: "lat",
            type: "number",
            required: true,
          },
          {
            key: "lng",
            type: "number",
            required: true,
          },
          {
            key: "is_active",
            type: "boolean",
            required: true,
          }
        ]
      }
    ]
  }
]

exports.createOfferings = Joi.object({
  data: Joi.object({
    details: Joi.array().items(
      Joi.object({
        business_id: Joi.string().uuid().required(),
        // Allow either category IDs or service_id
        category_level_0_id: Joi.string().uuid().optional(),
        category_level_1_id: Joi.string().uuid().allow(null).optional(),
        category_level_2_id: Joi.string().uuid().allow(null).optional(),
        service_id: Joi.string().uuid().optional(),
        name: Joi.string().required(),
        description: Joi.string().allow('').optional(),
        is_class: Joi.boolean().required(),
        is_archived: Joi.boolean().optional(),
        tags: Joi.array().items(Joi.string()).optional(),
        media_url: Joi.string().allow('').optional(),
        staff_ids: Joi.array().items(Joi.string().uuid()).optional(),
        durations: Joi.array().items(
          Joi.object({
            duration_minutes: Joi.number().integer().required(),
            price: Joi.number().required(),
            package_amount: Joi.number().optional(),
            package_person: Joi.number().optional()
          })
        ).optional(),
        location_pricing: Joi.array().items(
          Joi.object({
            location_id: Joi.string().uuid().required(),
            duration_minutes: Joi.number().integer().required(),
            price: Joi.number().required()
          })
        ).optional()
      }).custom((value, helpers) => {
        // Ensure either category IDs or service_id is provided
        const hasCategoryIds = value.category_level_0_id && value.category_level_1_id;
        const hasServiceId = value.service_id;
        
        if (!hasCategoryIds && !hasServiceId) {
          return helpers.error('any.invalid', { 
            message: 'Either category_level_0_id and category_level_1_id OR service_id must be provided' 
          });
        }
        
        if (hasCategoryIds && hasServiceId) {
          return helpers.error('any.invalid', { 
            message: 'Cannot provide both category IDs and service_id' 
          });
        }
        
        return value;
      })
    ).required()
  }).required()
});

exports.updateServiceDetail = [
  { key: 'name', type: 'string', required: true },
  { key: 'description', type: 'string', required: true },
  { 
    key: 'durations', 
    type: 'array', 
    required: true,
    items: [
      { key: 'id', type: 'string', required: false },
      { key: 'duration_minutes', type: 'number', required: true },
      { key: 'price', type: 'number', required: true },
      { key: 'package_amount', type: 'number', required: false },
      { key: 'package_person', type: 'number', required: false }
    ]
  },
  { key: 'spots_available', type: 'number', required: false }
];

const updateServiceDetailSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Class title is required',
    'any.required': 'Class title is required'
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required'
  }),
  durations: Joi.array().items(
    Joi.object({
      duration_minutes: Joi.number().integer().min(1).required().messages({
        'number.base': 'Duration must be a number',
        'number.integer': 'Duration must be a whole number',
        'number.min': 'Duration must be at least 1 minute',
        'any.required': 'Duration is required'
      }),
      price: Joi.number().precision(2).min(0).required().messages({
        'number.base': 'Price must be a number',
        'number.min': 'Price must be at least 0',
        'any.required': 'Price is required'
      }),
      package_amount: Joi.number().precision(2).min(0).allow(null).optional().messages({
        'number.base': 'Package amount must be a number',
        'number.min': 'Package amount must be at least 0'
      }),
      package_person: Joi.number().integer().min(1).allow(null).optional().messages({
        'number.base': 'Package person must be a number',
        'number.integer': 'Package person must be a whole number',
        'number.min': 'Package person must be at least 1'
      })
    })
  ).min(1).required().messages({
    'array.min': 'At least one duration is required',
    'any.required': 'Durations are required'
  }),
  spots_available: Joi.number().integer().min(1).allow(null).optional().messages({
    'number.base': 'Spots available must be a number',
    'number.integer': 'Spots available must be a whole number',
    'number.min': 'Spots available must be at least 1'
  })
});

module.exports = {
  createOfferings: exports.createOfferings,
  updateServiceDetail: exports.updateServiceDetail,
  updateServiceDetailSchema
};