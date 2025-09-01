'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'BusinessTranslations';



const locationData = [
  {
    id: '8c69a0bb-6a56-4f5c-a57d-5de099137d12',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    title: "Main Branch",
    address: "123 Wellness Street",
    city: "city",
    state: "state",
    slug: '0001-location-01',
    country: "country",
    latitude: 28.6139,
    longitude: 77.2090,
    is_active: true,
  },
  {
    id: 'bf4e8ee2-6b8e-440f-a1c1-e5eebdb3e653',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    title: "Yoga Retreat",
    address: "456 Tranquil Lane",
    city: "city",
    state: "state",
    country: "country",
    slug: '0001-location-02',
    latitude: 27.1767,
    longitude: 78.0081,
    is_active: true
  }
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const { Location, sequelize } = await getAllModels(
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

      for (const location of locationData) {
        const plocationDetail = await Location.findOne({
          where: { id: location.id },
        });

        if (!plocationDetail) {
          await Location.create(location, { transaction });
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT  ${tableName} OFF`,
        { transaction }
      );}
      await transaction.commit();
    } catch (error) {
      console.error('Error creating business location', error);
      await transaction.rollback();
    }
  },


  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  }
};