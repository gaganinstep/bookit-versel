'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClassSchedule extends Model {
    static associate(models) {
      // ✅ Corrected association
      ClassSchedule.belongsTo(models.BusinessService, {
        foreignKey: 'class_id',
        as: 'classService', // optional alias
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      ClassSchedule.belongsTo(models.Location, {
        foreignKey: 'location_id',
        as: 'Location', // Corrected alias
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Add association for instructors
      ClassSchedule.hasMany(models.ClassScheduleInstructor, {
        foreignKey: 'schedule_id',
        as: 'instructors'
      });
    }
  }

  ClassSchedule.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      class_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      location_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      day_of_week: {
        type: DataTypes.STRING,
        allowNull: false
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      package_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      package_person: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'ClassSchedule',
      tableName: 'ClassSchedules'
    }
  );

  return ClassSchedule;
};
