'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RolePermissions', {
       id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      permissionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Permissions',
          key: 'id',
        },
      },
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id',
        },
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('RolePermissions');
  },
};
