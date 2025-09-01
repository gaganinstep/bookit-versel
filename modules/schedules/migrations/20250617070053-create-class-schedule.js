'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClassSchedules', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      class_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'BusinessServices', // ✅ Corrected reference
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
        allowNull: false
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      package_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      package_person: {
        type: Sequelize.INTEGER,
        allowNull: true
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ClassSchedules');
  }
};
