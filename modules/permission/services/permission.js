const { getAllModels } = require("../../../middlewares/loadModels");

const create = async (payload) => {
  const { Permission } = await getAllModels(process.env.DB_TYPE);
  payload.name = payload.name.trim().replace(/ /g, "_").toLowerCase();
  payload.group_name = payload.group_name.toLowerCase();
  payload.isActive = true;
  if (typeof payload !== "object" || Object.keys(payload).length === 0) {
    throw { success: false, message: "Invalid request parameters" };
  }
  const result = new Permission(payload);
  return await result.save();
};

const updateRolePermission = async (payload) => {
  const { RolePermission, Role, sequelize } = await getAllModels(
    process.env.DB_TYPE
  );

  if (typeof payload !== "object" || Object.keys(payload).length === 0) {
    throw { success: false, message: "Invalid request parameters" };
  }

  const transaction = await sequelize.transaction();

  try {
    const { permissions, roleId, name } = payload;

    // Add or update role
    if (name) {
      await Role.update(
        { name: name.trim().replace(/ /g, "").toLowerCase() },
        { where: { id: roleId } },
        { transaction }
      );
    }

    // Fetch existing permissions for the role
    const existingPermissions = await RolePermission.findAll({
      where: { roleId },
      attributes: ["permissionId"],
      raw: true,
      transaction,
    });

    const existingPermissionIds = existingPermissions.map(
      (perm) => perm.permissionId
    );

    // Determine IDs to delete (not in the new permissions list)
    const deleteIds = existingPermissionIds.filter(
      (id) => !permissions.includes(id)
    );

    // Determine new permissions to add
    const newPermissions = permissions
      .filter((permissionId) => !existingPermissionIds.includes(permissionId))
      .map((permissionId) => ({
        roleId,
        permissionId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    // Remove unwanted permissions
    if (deleteIds.length > 0) {
      await RolePermission.destroy({
        where: {
          roleId,
          permissionId: deleteIds,
        },
        transaction,
      });
    }

    // Add new permissions
    if (newPermissions.length > 0) {
      await RolePermission.bulkCreate(newPermissions, {
        transaction,
        ignoreDuplicates: true, // Ensures no duplicate entries are added
      });
    }

    // Commit the transaction
    await transaction.commit();
    return {
      success: true,
      message: "Role permissions updated successfully",
      deletedPermissions: deleteIds,
    };
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    throw error;
  }
};

const createRolePermission = async (payload) => {
  const { RolePermission, Role, sequelize } = await getAllModels(
    process.env.DB_TYPE
  );

  if (typeof payload !== "object" || Object.keys(payload).length === 0) {
    throw { success: false, message: "Invalid request parameters" };
  }

  const transaction = await sequelize.transaction();
  let roleID = 0;

  try {
    const { permissions, name } = payload;

    // Add or update role
    const role = await Role.create(
      {
        name: name.trim().replace(/ /g, "").toLowerCase(),
        description: name,
        isActive: true,
      },
      { transaction }
    );
    roleID = role.id;

    const currentRoleId = roleID;

    // Determine new permissions to add
    const newPermissions = permissions.map((permissionId) => ({
      roleId: currentRoleId,
      permissionId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    if (newPermissions.length > 0) {
      await RolePermission.bulkCreate(newPermissions, {
        transaction,
      });
    }

    // Commit the transaction
    await transaction.commit();
    return {
      success: true,
      message: "Role permissions created successfully",
    };
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    throw error;
  }
};

const getPermissions = async (requestBody) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request Body" };
  }

  const { Permission } = await getAllModels(process.env.DB_TYPE);
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
  const permissionList = await Permission.findAndCountAll({
    where,
    include: includes,
    offset: (pageNumber - 1) * pageSize, // Skip this many records
    limit: pageSize,
    orderBy: [["id", "DESC"]],
  });
  return permissionList;
};

const getSelectedPermissions = async (requestBody) => {
  const { Permission } = await getAllModels(process.env.DB_TYPE);
  const { group } = requestBody;
  const includes = [];
  const where = { isActive: true };

  const permissionList = await Permission.findAll({
    where,
    include: includes,
    orderBy: [["name", "ASC"]],
  });

  const groupedPermissions = permissionList.reduce((acc, curr) => {
    const groupName = curr.group_name; // Replace with the actual field name for the group
    const group = acc.find((item) => item.group_name === groupName);

    if (group) {
      group.list.push(curr);
    } else {
      acc.push({ group_name: groupName, list: [curr] });
    }

    return acc;
  }, []);
  if (group) {
    return groupedPermissions;
  }
  return permissionList;
};

const updatePermission = async (payload,id) => {
  const { Permission, sequelize } = await getAllModels(process.env.DB_TYPE);

  if (typeof payload !== "object" || Object.keys(payload).length === 0) {
    throw { success: false, message: "Invalid request parameters" };
  }
  if (!id) {
    throw { success: false, message: "ID parameter is required" };
  }

  const transaction = await sequelize.transaction();

  try {
    const data = await Permission.update(payload, {
      where: { id } ,
      returning: true,
    });
    await transaction.commit();
    return data;
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    throw error;
  }
};

const deletePermission = async (id) => {
  const { Permission } = await getAllModels(process.env.DB_TYPE);
  const roleID = await Permission.update(
    { isActive: false },
    {
      where: { id },
    }
  );
  return roleID;
};



module.exports = {
  create,
  getPermissions,
  createRolePermission,
  updateRolePermission,
  getSelectedPermissions,
  updatePermission,
  deletePermission
};
