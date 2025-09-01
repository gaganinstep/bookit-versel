'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service_details' });
      Class.belongsTo(models.StaffProfile, { foreignKey: 'staff_profile_id' });
      Class.belongsTo(models.Location, { foreignKey: 'location_id' });
      Class.hasMany(models.ClassSchedule, { foreignKey: 'class_id' });
      Class.hasMany(models.Appointment, { foreignKey: 'class_id' });
      Class.hasMany(models.ClassTranslation, { foreignKey: 'class_id' });
      Class.hasMany(models.Business, { foreignKey: 'business_id' });
    }
  }
  Class.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    service_id: DataTypes.UUID,
    business_id: DataTypes.UUID,
    staff_profile_id: DataTypes.UUID,
    location_id: DataTypes.UUID,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    capacity: DataTypes.INTEGER,
    meeting_link: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Class',
  });
  return Class;
};