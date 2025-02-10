const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../database/db");

const Job = sequelize.define("Job", {
  job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company_name: {
    type: DataTypes.STRING,
  },

  job_location: {
    type: DataTypes.STRING,
  },
  company_logo: {
    type: DataTypes.STRING,
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
