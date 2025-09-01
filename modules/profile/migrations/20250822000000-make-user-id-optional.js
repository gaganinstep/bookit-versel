'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('StaffProfiles', 'user_id', {
      type: Sequelize.UUID,
      allowNull: true, // Make it optional
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('StaffProfiles', 'user_id', {
      type: Sequelize.UUID,
      allowNull: false, // Revert to required
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
