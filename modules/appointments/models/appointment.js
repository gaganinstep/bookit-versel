'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.User, { foreignKey: 'booked_by', as: 'booker' });
      Appointment.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
      Appointment.belongsTo(models.Business, { foreignKey: 'business_id', as: 'business' });
      Appointment.belongsTo(models.BusinessService, { foreignKey: 'business_service_id', as: 'business_service' });
      Appointment.belongsTo(models.Appointment, { foreignKey: 'rescheduled_from', as: 'previousAppointment' });
      Appointment.belongsTo(models.StaffProfile, { foreignKey: 'practitioner', as: 'staff_member' });
      Appointment.belongsTo(models.Location, { foreignKey: 'location_id', as: 'location_details' });
    }
  }
  Appointment.init({
    id: {
      allowNull: false, 
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4  
    },
    business_id: DataTypes.UUID,
    location_id: DataTypes.UUID,
    booked_by: DataTypes.UUID,
    business_service_id: DataTypes.UUID,
    rescheduled_from: DataTypes.UUID,
    status: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed", "booked", "rescheduled"),
    status_reason: DataTypes.STRING,
    class_id: DataTypes.UUID,
    practitioner: DataTypes.UUID,
    start_from: DataTypes.TIME,
    end_at: DataTypes.TIME,
    date: DataTypes.DATE,
    is_cancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};