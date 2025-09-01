'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'ServiceDurations';




const servicesDurationData = [
  {
    // health -> Acupuncture
    id: '1fc250f0-a55a-4729-9384-1b43d9c923fd',
    service_id: 'bc806349-1660-4592-a300-cec787eadf89',
    duration_minutes: '30',
    price: '300',
    location_id: 'bf4e8ee2-6b8e-440f-a1c1-e5eebdb3e653',
    is_active: true, 
  },
  {
    // health -> Audiology
    id: 'a1d2fe21-e024-47c1-8bd3-db6b82f44a8a',
    service_id: '98414441-4e17-4061-a76f-960a2aa23fa0',
    duration_minutes: '45',
    price: '320',
    location_id: '8c69a0bb-6a56-4f5c-a57d-5de099137d12',
    is_active: true, 
  },
  {
    // fitness -> Animal Flow
    id: 'e1e956f3-df38-46b7-b563-13ccb883edcc',
    service_id: '521ad8b7-aba7-4f81-b7d8-60d055c1cb26',
    duration_minutes: '90',
    price: '430',
    location_id: '8c69a0bb-6a56-4f5c-a57d-5de099137d12',
    is_active: true, 
  },
  {
    // fitness -> Barre
    id: 'fde13a85-79c0-4bd6-8027-194c07134dd0',
    service_id: 'bc806349-1660-4592-a300-cec787eadf89',
    duration_minutes: '60',
    price: '670',
    location_id: '8c69a0bb-6a56-4f5c-a57d-5de099137d12',
    is_active: true, 
  },
  {
    // beauty -> Body Treatments
    id: 'e7a3c613-2f1d-4985-b789-fda6d58e2135',
    service_id: 'bc806349-1660-4592-a300-cec787eadf89',
    duration_minutes: '60',
    price: '860',
    location_id: '8c69a0bb-6a56-4f5c-a57d-5de099137d12',
    is_active: true, 
  },
  {
    // beauty -> Eyelash and Eyebrow
    id: '4f28b7e2-862c-4dd6-80b7-2b4ce29ddc5a',
    service_id: 'bc806349-1660-4592-a300-cec787eadf89',
    duration_minutes: '30',
    price: '290',
    location_id: 'bf4e8ee2-6b8e-440f-a1c1-e5eebdb3e653',
    is_active: true, 
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const { ServiceDuration, sequelize } = await getAllModels(
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

      for (const serviceDuration of servicesDurationData) {
        const pServiceDurationDetail = await ServiceDuration.findOne({
          where: { id: serviceDuration.id },
        });

        if (!pServiceDurationDetail) {
          await ServiceDuration.create(serviceDuration, { transaction });
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT  ${tableName} OFF`,
        { transaction }
      );}
      await transaction.commit();
    } catch (error) {
      console.error('Error creating service duration', error);
      await transaction.rollback();
    }
  },


  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  }
};
