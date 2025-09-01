'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClientPreferences', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',     
      },
      preferred_categories: {
        type: Sequelize.STRING
      },
      preferred_locations: {
        type: Sequelize.STRING
      },
      allow_notifications: {
        type: Sequelize.BOOLEAN
      },
      preferred_days: {
        type: Sequelize.STRING
      },
      preferred_time_slots: {
        type: Sequelize.STRING
      },
      updated_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ClientPreferences');
  }
};