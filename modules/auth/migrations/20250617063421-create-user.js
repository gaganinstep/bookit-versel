'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      full_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      password_hash: {
        type: Sequelize.STRING
      },
      salt: {
        type: Sequelize.STRING
      },
      oauth_provider: {
        type: Sequelize.STRING
      },
      oauth_uid: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      is_verified: {
        type: Sequelize.BOOLEAN
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      preferred_language: {
        type: Sequelize.STRING
      },
      timezone: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.STRING,
      },
      otp_expires: {
        type: Sequelize.DATE,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    await queryInterface.dropTable('Users');
  }
};
