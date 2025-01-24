const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../database/db');

const User = sequelize.define('Job',{

    job_id:{
       type: DataTypes.INTEGER,
       primaryKey: true, 
       autoIncrement: true,
    } ,
    title: {
        type:DataTypes.STRING,
     },
    description: {
        type:DataTypes.STRING,

    },
    experience: {
        type:DataTypes.STRING,

    }
})

module.exports = Job;