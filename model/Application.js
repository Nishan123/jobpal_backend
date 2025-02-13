const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../database/db");

const Application = sequelize.define("Application", {
  job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  applied_by: {
    type: DataTypes.STRING,
  },

  cv: {
    type: DataTypes.STRING,
  },
});

module.exports = Application;
