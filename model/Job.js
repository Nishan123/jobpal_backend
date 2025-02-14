const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../database/db");

const Job = sequelize.define("Job", {
  job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  posted_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  company_name: {
    type: DataTypes.STRING,
  },

  job_location: {
    type: DataTypes.STRING,
  },
  company_logo: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('company_logo');
      if (!rawValue) return null;
      return rawValue;  // Return the raw value, we'll handle the URL construction in the frontend
    }
  },
  position: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  experience: {
    type: DataTypes.STRING,
  },
  salary: {
    type: DataTypes.STRING,
  },
});

module.exports = Job;
