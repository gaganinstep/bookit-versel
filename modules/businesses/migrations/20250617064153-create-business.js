'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Businesses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      website: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // ✅ Ensure slug is unique
      },
      user_slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      logo_url: {
        type: Sequelize.STRING,
      },
      cover_image_url: {
        type: Sequelize.STRING,
      },
      timezone: {
        type: Sequelize.STRING,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
      },
      is_onboarding_complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      active_step: {
        type: Sequelize.ENUM(
          'about_you',
          'locations',
          'services',
          'categories',
          'service_details',
          'complete_onboarding'
        ),
        allowNull: false,
        defaultValue: 'about_you',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Businesses');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Businesses_active_step";');
  },
};
