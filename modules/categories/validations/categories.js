exports.createCategory = [
  { key: "slug", type: "string", required: false },
  { key: "parent_id", type: "uuid", required: false },
  { key: "level", type: "number", required: false },
  { key: "name", type: "string", required: true },
  { key: "description", type: "string", required: false },
  { key: "is_class", type: "boolean", required: false },
  { key: "related_categories", type: "array", required: false },
];

exports.updateCategory = [
  { key: "slug", type: "string", required: false },
  { key: "parent_id", type: "uuid", required: false },
  { key: "level", type: "number", required: false },
  { key: "name", type: "string", required: false },
  { key: "description", type: "string", required: false },
  { key: "is_active", type: "boolean", required: false },
];
