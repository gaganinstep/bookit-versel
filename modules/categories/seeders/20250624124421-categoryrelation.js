"use strict";

const { v4: uuidv4 } = require("uuid");
const { supportedDbTypes } = require("../utils/staticData");
const { getAllModels } = require("../../../middlewares/loadModels");

const tableName = "CategoryRelation";

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const { CategoryRelation, sequelize } = await getAllModels(process.env.DB_TYPE);

    await sequelize.sync();

    const transaction = await sequelize.transaction();

    try {
      const healthId = "7cb0fbb6-69d6-49c1-86b4-a524f2b6573c";
      const fitnessId = "e55a7926-103b-496f-a11f-4eb5a09a37a3";
      const beautyId = "d06d4da7-dcda-4128-846f-3d9cd5cabe01";

      const categoriesRelationData = [
        {
          id: "044e9a93-3693-4205-a98b-6c371232dd86",
          category_id: healthId,
          related_category_id: fitnessId,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "83f64238-29d9-47e4-85fd-4488985a9ff7",
          category_id: fitnessId,
          related_category_id: healthId,
          createdAt: now,
          updatedAt: now,
        }
      ]


      if (process.env.DB_TYPE === supportedDbTypes.mssql) {
        await queryInterface.sequelize.query(
          `SET IDENTITY_INSERT ${tableName} ON`,
          { transaction }
        );
      }

      for (const categoryRelation of categoriesRelationData) {
        const exists = await CategoryRelation.findOne({
          where: { id: categoryRelation.id },
        });
        if (!exists) {
          await CategoryRelation.create(categoryRelation, { transaction });
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql) {
        await queryInterface.sequelize.query(
          `SET IDENTITY_INSERT ${tableName} OFF`,
          { transaction }
        );
      }

      await transaction.commit();
    } catch (error) {
      console.error("Error seeding categories:", error);
      await transaction.rollback();
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
