"use strict";

const { supportedDbTypes } = require("../utils/staticData");
const { getAllModels } = require("../../../middlewares/loadModels");
const tableName = "BusinessTranslations";

const businessCategoriesData = [
  {
    id: "95ab4f57-4e8d-42e2-8ff7-5072d25aab6a",
    business_id: "577f80d2-0b80-4d88-bb7a-df38b9f0d7ec",
    category_id: "7cb0fbb6-69d6-49c1-86b4-a524f2b6573c",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { BusinessCategory, sequelize } = await getAllModels(
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

      for (const businessCategory of businessCategoriesData) {
        const pbusinessCategoryDetail = await BusinessCategory.findOne({
          where: { id: businessCategory.id },
        });

        if (!pbusinessCategoryDetail) {
          await BusinessCategory.create(businessCategory, { transaction });
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
      console.error("Error creating business category", error);
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
