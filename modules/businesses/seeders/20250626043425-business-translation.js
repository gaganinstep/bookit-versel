'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'BusinessTranslations';



const businessTranslationsData = [
  {
    id: '7c6eb6be-90e7-40e6-b3db-5408d527f926',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    language_code: 'en',
    name: 'English',
    description: 'This is a buisness translation for super admin',
  }
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const { BusinessTranslation, sequelize } = await getAllModels(
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

      for (const businessTranslation of businessTranslationsData) {
        const pbusinessTranslationDetail = await BusinessTranslation.findOne({
          where: { id: businessTranslation.id },
        });

        if (!pbusinessTranslationDetail) {
          await BusinessTranslation.create(businessTranslation, { transaction });
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT  ${tableName} OFF`,
        { transaction }
      );}
      await transaction.commit();
    } catch (error) {
      console.error('Error creating business translation', error);
      await transaction.rollback();
    }
  },


  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  }
};