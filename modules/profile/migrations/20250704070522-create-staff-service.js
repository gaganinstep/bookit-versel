'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StaffServices', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      staff_profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'StaffProfiles',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      service_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      is_class: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('StaffServices');
  }
};
