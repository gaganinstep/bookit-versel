'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'BusinessTranslations';

const healthId = "7cb0fbb6-69d6-49c1-86b4-a524f2b6573c";
const fitnessId = "e55a7926-103b-496f-a11f-4eb5a09a37a3";
const beautyId = "d06d4da7-dcda-4128-846f-3d9cd5cabe01";

const categoriesTranslationsData = [
  {
    id: "2836e228-96ac-40e3-9494-ea037e76f711",
    category_id: healthId,
    language_code: 'en',
    name: 'English',
    description: 'This is a category translation for health',
  },
  {
    id: "1fb89049-bb4d-45b7-99de-cb523d2a7d33",
    category_id: fitnessId,
    language_code: 'en',
    name: 'English',
    description: 'This is a category translation for fitness',
  },
  {
    id: "5c1307cb-3c16-4f32-8634-b36616efc339",
    category_id: beautyId,
    language_code: 'en',
    name: 'English',
    description: 'This is a category translation for beauty',
  },
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const { CategoryTranslation, sequelize } = await getAllModels(
      process.env.DB_TYPE
    );
    await sequelize.sync();  
    
    const transaction = await sequelize.transaction();

    try {
      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT ${tableName} ON`,
        { transaction }
      );}

      for (const categoryTranslation of categoriesTranslationsData) {
        const pCategoryTranslationDetail = await CategoryTranslation.findOne({
          where: { id: categoryTranslation.id },
        });

        if (!pCategoryTranslationDetail) {
          await CategoryTranslation.create(categoryTranslation, { transaction });
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT  ${tableName} OFF`,
        { transaction }
      );}
      await transaction.commit();
    } catch (error) {
      console.error('Error creating category translations', error);
      await transaction.rollback();
    }
  },


  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  }
};