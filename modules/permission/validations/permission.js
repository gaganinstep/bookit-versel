exports.permissionInput = [
  { key: "name", type: "string", required: true },
  { key: "description", type: "string", required: false },
  { key: "route", type: "string", required: true },
  { key: "action", type: "string", required: true },
  { key: "type", type: "string", required: true },
  { key: "group_name", type: "string", required: true },
];

exports.rolePermissionUpdateInput = [
  { key: "roleId", type: "number", required: true },
  { key: "name", type: "string", required: false },
  { key: "permissions", type: "array", required: true },
];

exports.rolePermissionCreateInput = [
  { key: "name", type: "string", required: true },
  { key: "permissions", type: "array", required: true },
];

exports.permissionUpdateInput = [
  { key: "id", type: "number", required: true },
  { key: "name", type: "string", required: true },
  { key: "description", type: "string", required: false },
  { key: "route", type: "string", required: true },
  { key: "type", type: "string", required: true },
  { key: "isActive", type: "string", required: true },
  { key: "action", type: "string", required: true },
  { key: "group_name", type: "string", required: true },
];
