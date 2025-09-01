'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StaffSchedules', {
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
      location_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      day: {
        type: Sequelize.ENUM(
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday'
        ),
        allowNull: false,
        defaultValue: 'monday'
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false
      },
      to: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('StaffSchedules');
  }
};
