'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StaffProfiles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      location_id: {
        type: Sequelize.ARRAY(Sequelize.UUID),
      },
      name: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.TEXT,
      },
      phone_number: {
        type: Sequelize.TEXT,
      },
      gender: Sequelize.ENUM('male', 'female'),
      profile_photo_url: {
        type: Sequelize.STRING,
        allowNull: true, // ✅ fixed typo
      },
      is_available: {
        type: Sequelize.BOOLEAN,
      },
      for_class: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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
    await queryInterface.dropTable('StaffProfiles');
  },
};
