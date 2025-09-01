"use strict";

const { supportedDbTypes } = require("../utils/staticData");
const { getAllModels } = require("../../../middlewares/loadModels");
const tableName = "BusinessHours";

const businessHoursData = [
  {
    id: "8b5f2cb1-e8a4-4f95-a445-12b4d8dd697c",
    location_id: "bf4e8ee2-6b8e-440f-a1c1-e5eebdb3e653",
    day_of_week: "5",
    open_time: "10:00:00",
    close_time: "17:30:00",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { BusinessHour, sequelize } = await getAllModels(process.env.DB_TYPE);
    await sequelize.sync();

    const transaction = await sequelize.transaction();

    try {
      if (process.env.DB_TYPE === supportedDbTypes.mssql) {
        await queryInterface.sequelize.query(
          `SET IDENTITY_INSERT ${tableName} ON`,
          { transaction }
        );
      }

      for (const businessHour of businessHoursData) {
        const pbusinessHourDetail = await BusinessHour.findOne({
          where: { id: businessHour.id },
        });

        if (!pbusinessHourDetail) {
          await BusinessHour.create(businessHour, { transaction });
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql) {
        await queryInterface.sequelize.query(
          `SET IDENTITY_INSERT  ${tableName} OFF`,
          { transaction }
        );
      }
      await transaction.commit();
    } catch (error) {
      console.error("Error creating business hours", error);
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
