'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'Permissions';
const rolePermissionsTableName = 'RolePermissions';

// User data to seed
const permissionsData = [
  {
    id: '93dd815e-0ca1-438c-ae00-32cd6def6b4e',
    name: 'user_detail',
    description: 'get user detail',
    route: 'users/detail',
    type: 'backend',
    action: 'get',
    group_name: 'user',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '64910fb1-7362-48cb-8310-4937ad961104',
    name: 'dashboard',
    description: 'dashboard page',
    route: 'dashboard',
    type: 'frontend',
    action: 'get',
    group_name: 'dashboard',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '1d76a5a6-1310-4b03-93ba-ae8cf92a9f2f',
    name: 'permission_list',
    description: 'get permission list',
    route: 'permission/list',
    type: 'backend',
    action: 'get',
    group_name: 'permission',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2b9dde7f-1789-461b-86d0-b93686408761',
    name: 'role_list',
    description: 'get role list',
    route: 'role/list',
    type: 'backend',
    action: 'get',
    group_name: 'role',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '665d7c1a-b3ff-41fb-a7eb-bd4d07ac5825',
    name: 'role_list',
    description: 'role list view',
    route: 'rolePermissions/role',
    type: 'frontend',
    action: 'get',
    group_name: 'role',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

module.exports = {
  async up(queryInterface) {
    const { Permission, RolePermission, sequelize } = await getAllModels(
      process.env.DB_TYPE
    );
    await sequelize.sync(); // Reset the database
    const transaction = await sequelize.transaction();
    try {
      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT ${tableName} ON`,
        { transaction }
      );}

      for (const permission of permissionsData) {
        // Create each permission
        const permissionDetail = await Permission.findOne({
          where: { id: permission.id },
        });
        if (!permissionDetail) {
          const createdPermission = await Permission.create(permission, {
            transaction,
          });

          // Add an entry in UserRoles table for the created user
          await RolePermission.create(
            {
              permissionId: createdPermission.id,
              roleId: 'ae7cfef5-57ae-4a94-8272-2e6a619c94b1', // Assuming a default roleId, replace with actual logic as needed
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            { transaction }
          );
        } else {
          await Permission.update(
            permission,
            {
              where: { id: permission.id },
            },
            { transaction }
          );
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT  ${tableName} OFF`,
        { transaction }
      );}
      await transaction.commit();
    } catch (error) {
      // Rollback the transaction in case of an error
      console.error('Error creating permission and role permission:', error);
      await transaction.rollback();
    }
  },

  async down(queryInterface) {
    // Remove all entries from UserRoles and Users
    await queryInterface.bulkDelete(rolePermissionsTableName, null, {});
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
