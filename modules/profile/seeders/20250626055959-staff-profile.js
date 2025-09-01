'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'StaffProfiles';



const profilesData = [
  {
    id: '3c5d7536-e6d0-4a5b-8d5b-aa477b1f2590',
    user_id: '2e3ae552-f447-47d3-bca4-69e01776990a',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    category_id: ['7cb0fbb6-69d6-49c1-86b4-a524f2b6573c'],
    location_id: [
      '8c69a0bb-6a56-4f5c-a57d-5de099137d12',
      'bf4e8ee2-6b8e-440f-a1c1-e5eebdb3e653'
    ],
    name: 'Fatima Bombo',
    email: 'fbombo@yourbusiness.com',
    phone_number: '0123456789',
    gender: 'male',
    for_class: false,
    profile_photo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKgUUpHpc-JwcJiRLScAepL-T3oeaxR8T5A&s',
    is_available: true
  },
  {
    id: '51f02b80-cd88-46e3-978a-ed612fb95305',
    user_id: '2e3ae552-f447-47d3-bca4-69e01776990a',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    category_id: ['7cb0fbb6-69d6-49c1-86b4-a524f2b6573c'],
    location_id: [
      '8c69a0bb-6a56-4f5c-a57d-5de099137d12',
      '91d89fd1-c8e2-4d5d-bae6-13df0c50b9b2'
    ],
    name: 'User 1',
    email: 'user1@yourbusiness.com',
    phone_number: '0123456789',
    gender: 'male',
    for_class: false,
    profile_photo_url: null,
    is_available: true
  },
  {
    id: '555843a6-1d7f-498d-acd2-5fb8b903915e',
    user_id: '2e3ae552-f447-47d3-bca4-69e01776990a',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    category_id: ['7cb0fbb6-69d6-49c1-86b4-a524f2b6573c'],
    location_id: ['91d89fd1-c8e2-4d5d-bae6-13df0c50b9b2'],
    name: 'User 2',
    email: 'user2@yourbusiness.com',
    phone_number: '0123456789',
    gender: 'male',
    for_class: false,
    profile_photo_url: null,
    is_available: true
  },
  {
    id: 'f4f9764d-bcaa-4ef4-a3bb-f2dd73e211b6',
    user_id: '2e3ae552-f447-47d3-bca4-69e01776990a',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    category_id: ['7cb0fbb6-69d6-49c1-86b4-a524f2b6573c'],
    location_id: ['8c69a0bb-6a56-4f5c-a57d-5de099137d12'],
    name: 'Madhav Jangid',
    email: 'Madhav@yourbusiness.com',
    phone_number: '0987654321',
    gender: 'male',
    for_class: false,
    profile_photo_url: null,
    is_available: false
  }
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const { StaffProfile, sequelize } = await getAllModels(
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

      for (const profile of profilesData) {
        const pProfilesDetail = await StaffProfile.findOne({
          where: { id: profile.id },
        });

        if (!pProfilesDetail) {
          await StaffProfile.create(profile, { transaction });
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
