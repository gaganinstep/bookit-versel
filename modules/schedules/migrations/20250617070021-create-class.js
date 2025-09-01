'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Classes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      business_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Businesses',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      service_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Services',
            key: 'id',
          },
          onDelete: 'CASCADE',
      },
      staff_profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'StaffProfiles',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      location_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
      },
      capacity: {
        type: Sequelize.INTEGER
      },
      meeting_link: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Classes');
  }
};