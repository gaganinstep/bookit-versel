const Joi = require("joi");

exports.buildSchema = (fields) => {

  const schemaDefinition = {};

  // Handle wrapper schema if top-level keys like "step" and "data" are included
  const isTopLevelWrapper = fields.some(field => field.key === "step" || field.key === "data");

  if (isTopLevelWrapper) {
    fields.forEach((field) => {
      if (field.key === "step") {
        schemaDefinition["step"] = Joi.string()
          .valid("about_you", "locations", "categories", "services", "service_details", "complete_onboarding")
          .required();
      } else if (field.key === "data" && field.fields) {
        schemaDefinition["data"] = exports.buildSchema(field.fields).required();
      }
    });

    return Joi.object(schemaDefinition);
  }

  // Default: build schema normally
  fields.forEach((field) => {
    let fieldSchema;

    switch (field.type) {
      case "uuid":
        fieldSchema = Joi.string().uuid();
        break;
      case "email":
        fieldSchema = Joi.string().email();
        break;
      case "string":
        fieldSchema = Joi.string();
        break;
      case "number":
        fieldSchema = Joi.number();
        break;
      case "boolean":
        fieldSchema = Joi.boolean();
        break;
      case "float":
        fieldSchema = Joi.number().precision(8);
        break;

      // this accepts normal ISO date formt "2025-07-16"
      case "date":
        fieldSchema = Joi.string().isoDate().pattern(/^\d{4}-\d{2}-\d{2}$/);
        break;
      // this accepts only UTC time formt "09:00:00" its a 24h time format
      case "time":
        fieldSchema = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/);
        break;
        // this accepts only UTC date-time formt "2025-07-16T09:30:00Z"
      case "datetime_utc":
        fieldSchema = Joi.string().isoDate().pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/);
        break;


      case "array":
        if (field.items && Array.isArray(field.items)) {
          const itemSchema = exports.buildSchema(field.items).unknown(false);
          fieldSchema = Joi.array().items(itemSchema);
        } else {
          fieldSchema = Joi.array();
        }
        break;
      case "object":
        if (field.fields) {
          fieldSchema = exports.buildSchema(field.fields);
        } else {
          fieldSchema = Joi.object();
        }
        break;
      default:
        throw new Error(`Unsupported field type: ${field.type}`);
    }

    if (field.required) {
      fieldSchema = fieldSchema.required().not().empty();
    } else {
      fieldSchema = fieldSchema.optional().allow("", null);
    }

    if (field.min) {
      fieldSchema = fieldSchema.min(field.min);
    }

    if (field.max) {
      fieldSchema = fieldSchema.max(field.max);
    }

    if (field.regex) {
      fieldSchema = fieldSchema.pattern(new RegExp(field.regex));
    }

    schemaDefinition[field.key] = fieldSchema;
  });

  return Joi.object(schemaDefinition);
};
