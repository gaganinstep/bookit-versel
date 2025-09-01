"use strict";

const { supportedDbTypes } = require("../utils/staticData");
const { getAllModels } = require("../../../middlewares/loadModels");
const tableName = "BusinessServiceDurations";
const now = new Date();

const businessServiceDurationsData = [
  {
    id: "ba2cca75-421b-4aad-ad4f-215f0b2945eb",
    business_id: "577f80d2-0b80-4d88-bb7a-df38b9f0d7ec",
    service_detail_id: "c00c4387-c8c2-4f5c-9bdf-9bb1dc72eab8",
    duration_minutes: 90,
    price: "1200",
    package_amount: "1200",
    package_person: 6,
    created_at: now,
    updated_at: now,
  }, 
  {
    id: "929788c8-5f78-4b67-9b80-c0f2bcb0b48f",
    business_id: "577f80d2-0b80-4d88-bb7a-df38b9f0d7ec",
    service_detail_id: "12caca52-0978-4873-883e-db6cbb94fe09",
    duration_minutes: 90,
    price: "1200",
    package_amount: "1200",
    package_person: 6,
    created_at: now,
    updated_at: now,
  }, 
];



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const { BusinessServiceDuration, sequelize } = await getAllModels(
      process.env.DB_TYPE
    );
    await sequelize.sync();

    const transaction = await sequelize.transaction();

    try {
      if (process.env.DB_TYPE === supportedDbTypes.mssql) {
        await queryInterface.sequelize.query(
          `SET IDENTITY_INSERT ${tableName} ON`,
          { transaction }
        );
      }

      for (const businessServiceDuration of businessServiceDurationsData) {
        const pbusinessServiceDetail = await BusinessServiceDuration.findOne({
          where: { id: businessServiceDuration.id },
        });

        if (!pbusinessServiceDetail) {
          await BusinessServiceDuration.create(businessServiceDuration, { transaction });
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
      console.error("Error creating business services", error);
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) { 
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
