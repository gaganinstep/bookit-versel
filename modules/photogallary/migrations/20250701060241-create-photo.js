'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Photos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      gallery_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'PhotoGalleries',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      photo_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
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
    await queryInterface.dropTable('Photos');
  }
};
