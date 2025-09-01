'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientProfile extends Model {
    static associate(models) {
      ClientProfile.belongsTo(models.User, { foreignKey: 'user_id' });
  
    }
  }
  ClientProfile.init({
    id: {
      allowNull: false, 
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: DataTypes.UUID,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    onboarding_completed: DataTypes.BOOLEAN,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ClientProfile',
  });
  return ClientProfile;
};