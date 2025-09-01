"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CategoryRelations", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      related_category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CategoryRelations");
  },
};
