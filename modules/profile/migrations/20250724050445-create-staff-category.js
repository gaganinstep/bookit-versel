'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StaffCategories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      staff_profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'StaffProfiles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

  async down(queryInterface) {
    await queryInterface.dropTable('StaffCategories');
  },
};
