'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceDuration extends Model {
    static associate(models) {
      ServiceDuration.belongsTo(models.Service, { foreignKey: 'service_id' });
      ServiceDuration.belongsTo(models.Location, { foreignKey: 'location_id' });

    }
  }
  ServiceDuration.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    service_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    duration_minutes: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    location_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ServiceDuration',
  });
  return ServiceDuration;
};