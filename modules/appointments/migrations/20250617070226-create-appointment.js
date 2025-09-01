"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Appointments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      business_id: {
        type: Sequelize.UUID,
        references: {
          model: "Businesses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      booked_by: {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      business_service_id: {
        type: Sequelize.UUID,
        references: {
          model: "BusinessServices",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      rescheduled_from: {
        type: Sequelize.UUID,
        references: {
          model: "Appointments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "confirmed", "cancelled", "completed", "booked", "rescheduled"),
      },
      status_reason: {
        type: Sequelize.STRING,
      },
      class_id: {
        type: Sequelize.UUID,
        references: {
          model: "Classes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      practitioner: {
        type: Sequelize.UUID,
        references: {
          model: "StaffProfiles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      start_from: {
        type: Sequelize.TIME,
      },
      end_at: {
        type: Sequelize.TIME,
      },
      date: {
        type: Sequelize.DATE,
      },
      is_cancelled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Appointments");
  },
};
