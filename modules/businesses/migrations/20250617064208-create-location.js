'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Locations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      business_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Businesses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      floor: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      instructions: {
        type: Sequelize.TEXT,
      },
      latitude: {
        type: Sequelize.FLOAT,
      },
      longitude: {
        type: Sequelize.FLOAT,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    await queryInterface.dropTable('Locations');
  },
};
