const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const Job = require("./Job");

const Application = sequelize.define("Application", {
  application_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'job_id'
    }
  },
  applicant_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  applied_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  cv_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'accepted', 'rejected'),
    defaultValue: 'pending'
  },
  applied_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Define relationship with Job model
Application.belongsTo(Job, { foreignKey: 'job_id' });
Job.hasMany(Application, { foreignKey: 'job_id' });

module.exports = Application;
