const { getAllModels } = require('../../../middlewares/loadModels');

const createRole = async (payload) => {
  const { Role } = await getAllModels(process.env.DB_TYPE);
  if (typeof payload !== 'object' || Object.keys(payload).length === 0) {
    throw { success: false, message: 'Invalid request parameters' };
  }
  payload.name = payload.name.trim().replace(/ /g, '').toLowerCase();
  const result = new Role(payload);
  return await result.save();
};

const getRoles = async (requestBody) => {
  if (
    typeof requestBody !== 'object' ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: 'Invalid request Body' };
  }

  const { Role } = await getAllModels(process.env.DB_TYPE);
  const { active } = requestBody;

  const pageNumber = requestBody.pageNumber ? requestBody.pageNumber : 1;
  const pageSize = requestBody.pageSize ? requestBody.pageSize : 10;
  const includes = [];
  let where = {};

  if (active) {
    where = {
      ...where,
      ...{
        isActive: active ? active : true,
      },
    };
  }
  const permissionList = await Role.findAndCountAll({
    where,
    include: includes,
    offset: (pageNumber - 1) * pageSize, // Skip this many records
    limit: pageSize,
    orderBy: [['id', 'DESC']],
  });
  return permissionList;
};

const getRolePermissionList = async (requestBody) => {
  if (
    typeof requestBody !== 'object' ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: 'Invalid request Body' };
  }

  const { Role, Permission, RolePermission } = await getAllModels(
    process.env.DB_TYPE
  );
  const { active } = requestBody;

  const pageNumber = requestBody.pageNumber ? requestBody.pageNumber : 1;
  const pageSize = requestBody.pageSize ? requestBody.pageSize : 10;
  const includes = [
    {
      model: Permission,
      as: 'permissions',
      through: {
        model: RolePermission,
      },
    },
  ];
  let where = {};

  if (active) {
    where = {
      ...where,
      ...{
        isActive: active ? active : true,
      },
    };
  }
  const roleList = await Role.findAndCountAll({
    where,
    include: includes,
    offset: (pageNumber - 1) * pageSize, // Skip this many records
    limit: pageSize,
    distinct: true,
    orderBy: [['id', 'DESC']],
  });
  return roleList;
};

const getRoleDetail = async (id) => {
  const { Role, Permission, RolePermission } = await getAllModels(
    process.env.DB_TYPE
  );
  const includes = [
    {
      model: Permission,
      as: 'permissions',
      through: {
        model: RolePermission,
      },
    },
  ];
  const where = { id };

  const roleList = await Role.findOne({
    where,
    include: includes,
  });
  return roleList;
};

module.exports = {
  createRole,
  getRoles,
  getRolePermissionList,
  getRoleDetail,
};
