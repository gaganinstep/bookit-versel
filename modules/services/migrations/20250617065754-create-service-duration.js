'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ServiceDurations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      service_id: {
        type: Sequelize.UUID,  
        allowNull: false,
        references: {
          model: 'Services',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      duration_minutes: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.DECIMAL,
      },
      location_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ServiceDurations');
  }
};
