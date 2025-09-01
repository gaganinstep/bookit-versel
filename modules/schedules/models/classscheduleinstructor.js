'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClassScheduleInstructor extends Model {
    static associate(models) {
      ClassScheduleInstructor.belongsTo(models.ClassSchedule, {
        foreignKey: 'schedule_id',
        onDelete: 'CASCADE'
      });
      ClassScheduleInstructor.belongsTo(models.StaffProfile, {
        foreignKey: 'instructor_id',
        as: 'instructor',
        onDelete: 'CASCADE'
      });
    }
  }

  ClassScheduleInstructor.init(
    {
      schedule_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },
      instructor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      }
    },
    {
      sequelize,
      modelName: 'ClassScheduleInstructor',
      tableName: 'ClassScheduleInstructors',
      timestamps: true
    }
  );

  return ClassScheduleInstructor;
};
