'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BusinessServiceDurations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      business_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Businesses',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      service_detail_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'BusinessServiceDetails',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      duration_minutes: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      package_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      package_person: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('BusinessServiceDurations');
  },
};