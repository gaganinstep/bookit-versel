"use strict";

const { supportedDbTypes } = require("../utils/staticData");
const { getAllModels } = require("../../../middlewares/loadModels");
const tableName = "BusinessServices";

const businessServiceData = [
  {
    id: "d39debc3-071f-4897-b131-e50b41b6d7d1",
    business_id: "577f80d2-0b80-4d88-bb7a-df38b9f0d7ec",
    category_id: "7cb0fbb6-69d6-49c1-86b4-a524f2b6573c",
    is_active: true,
  },
  {
    id: "5c2e205c-229f-40ed-b044-580c2a141ac5",
    business_id: "577f80d2-0b80-4d88-bb7a-df38b9f0d7ec",
    category_id: "e55a7926-103b-496f-a11f-4eb5a09a37a3",
    is_active: true,
    is_class: true,
  },
];



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const { BusinessService, sequelize } = await getAllModels(
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

      for (const businessService of businessServiceData) {
        const pbusinessServiceDetail = await BusinessService.findOne({
          where: { id: businessService.id },
        });

        if (!pbusinessServiceDetail) {
          await BusinessService.create(businessService, { transaction });
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
      // Rollback the transaction in case of an error
      console.error("Error creating business services", error);
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) { 
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
