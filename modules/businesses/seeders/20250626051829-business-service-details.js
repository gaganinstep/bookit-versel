"use strict";

const { supportedDbTypes } = require("../utils/staticData");
const { getAllModels } = require("../../../middlewares/loadModels");
const tableName = "BusinessServiceDetails";
    const now = new Date();

const businessServiceDetailsData = [
  {
    id: "c00c4387-c8c2-4f5c-9bdf-9bb1dc72eab8",
    business_id: "577f80d2-0b80-4d88-bb7a-df38b9f0d7ec",
    service_id: "d39debc3-071f-4897-b131-e50b41b6d7d1",
    name: "Acupuncture",
    description: "this is the acupuncture service....",
    created_at: now,
    updated_at: now,
  }, 
  {
    id: "12caca52-0978-4873-883e-db6cbb94fe09",
    business_id: "577f80d2-0b80-4d88-bb7a-df38b9f0d7ec",
    service_id: "5c2e205c-229f-40ed-b044-580c2a141ac5",
    name: "Animal flow",
    description: "This is a business flow class....",
    created_at: now,
    updated_at: now,
  }, 
];



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const { BusinessServiceDetail, sequelize } = await getAllModels(
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

      for (const businessServiceDetails of businessServiceDetailsData) {
        const pbusinessServiceDetail = await BusinessServiceDetail.findOne({
          where: { id: businessServiceDetails.id },
        });

        if (!pbusinessServiceDetail) {
          await BusinessServiceDetail.create(businessServiceDetails, { transaction });
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
