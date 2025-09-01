'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'StaffSchedules';




const staffScheduleData = [
  {
    id: '267cb0b0-90fa-45b2-b6b7-755a8d789cab',
    staff_profile_id: '3c5d7536-e6d0-4a5b-8d5b-aa477b1f2590',
    location_id: '8c69a0bb-6a56-4f5c-a57d-5de099137d12',
    day: 'monday',
    from: '09:00: AM',
    to: '06:00 PM',
  }, 
  {
    id: 'b067805f-fd1d-4600-a6a0-0ee55bcd9683',
    staff_profile_id: '3c5d7536-e6d0-4a5b-8d5b-aa477b1f2590',
    location_id: '8c69a0bb-6a56-4f5c-a57d-5de099137d12',
    day: 'tuesday',
    from: '10:00: AM',
    to: '05:00 PM',
  }, 
  {
    id: 'b858df6e-8432-4965-95d8-02d1dbffaaaf',
    staff_profile_id: '51f02b80-cd88-46e3-978a-ed612fb95305',
    location_id: '8c69a0bb-6a56-4f5c-a57d-5de099137d12',
    day: 'thursday',
    from: '09:00: AM',
    to: '06:00 PM',
  }, 
  {
    id: '3c5d7536-e6d0-4a5b-8d5b-aa477b1f2590',
    staff_profile_id: '51f02b80-cd88-46e3-978a-ed612fb95305',
    location_id: '8c69a0bb-6a56-4f5c-a57d-5de099137d12',
    day: 'saturday',
    from: '10:00: AM',
    to: '05:00 PM',
  }, 
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const { StaffSchedule, sequelize } = await getAllModels(
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

      for (const staffSchedule of staffScheduleData) {
        const pProfilesDetail = await StaffSchedule.findOne({
          where: { id: staffSchedule.id },
        });

        if (!pProfilesDetail) {
          await StaffSchedule.create(staffSchedule, { transaction });
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT  ${tableName} OFF`,
        { transaction }
      );}
      await transaction.commit();
    } catch (error) {
      console.error('Error creating staff profile', error);
      await transaction.rollback();
    }
  },


  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  }
};
