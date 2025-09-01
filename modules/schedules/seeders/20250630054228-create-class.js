'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'Classes';

// User data to seed
const classData = [
  {
    id:"d16cb2d5-0cc3-4a19-9de7-62bff81e14af",
    service_id: "521ad8b7-aba7-4f81-b7d8-60d055c1cb26",
    business_id: "577f80d2-0b80-4d88-bb7a-df38b9f0d7ec",
    staff_profile_id: "3c5d7536-e6d0-4a5b-8d5b-aa477b1f2590",
    location_id: "8c69a0bb-6a56-4f5c-a57d-5de099137d12",
    start_time: "2025-06-30T10:00:00Z",
    end_time: "2025-06-30T11:00:00Z",
    capacity: 100,
    meeting_link: "https://meet.google.com/",
    status: "PENDING"
  } 
];

module.exports = {
  async up(queryInterface) {
    const { Class, sequelize } = await getAllModels(
      process.env.DB_TYPE
    );
    await sequelize.sync(); // Reset the database
    const transaction = await sequelize.transaction();
    try {
      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT ${tableName} ON`,
        { transaction }
      );}

      for (const classSchedule of classData) {
        // Create each user
        const puserDetail = await Class.findOne({
          where: { id: classSchedule.id },
        });
        if (!puserDetail) {
          const createdClass = await Class.create(classSchedule, { transaction });
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT  ${tableName} OFF`,
        { transaction }
      );}
      await transaction.commit();
    } catch (error) {
      // Rollback the transaction in case of an error
      console.error('Error creating users and user roles:', error);
      await transaction.rollback();
    }
  },

  async down(queryInterface) {
    // Remove all entries from UserRoles and Users
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
