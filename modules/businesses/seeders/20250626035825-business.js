'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'Businesses';




const businessesData = [
  {
    id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    user_id: '2e3ae552-f447-47d3-bca4-69e01776990a',
    name: 'super admin',
    user_slug: 'super-admin',
    email: 'super.admin@gmail.com',
    phone: '+911234567890',
    website: 'https://insteptechnologies.com/',
    slug: 'main-branch-0001',
    logo_url: 'https://insteptechnologies.com/wp-content/uploads/2025/02/instep-logo-white.webp',
    cover_image_url: 'https://s3.amazonaws.com/handshake.production/app/public/assets/institutions/377562/cover/hs-emp-branding-image-data.?1642612359',
    timezone: 'Asia/Kolkata',
    is_active: true, 
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const { Business, sequelize } = await getAllModels(
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

      for (const business of businessesData) {
        const pbusinessDetail = await Business.findOne({
          where: { id: business.id },
        });

        if (!pbusinessDetail) {
          await Business.create(business, { transaction });
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT  ${tableName} OFF`,
        { transaction }
      );}
      await transaction.commit();
    } catch (error) {
      console.error('Error creating business', error);
      await transaction.rollback();
    }
  },


  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  }
};
