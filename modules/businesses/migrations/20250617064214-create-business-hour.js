'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BusinessHours', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      location_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      day_of_week: {
        type: Sequelize.STRING,
      },
      open_time: {
        type: Sequelize.TIME,
      },
      close_time: {
        type: Sequelize.TIME,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BusinessHours');
  }
};
