const {DataTypes}  = require('sequelize')
const sequelize = require('../config/database')

const Project = sequelize.define('Project',{

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    tittle:{
        type: DataTypes.STRING,
        allowNull: false
    },

    description:{
        type: DataTypes.STRING,
        allowNull: false
    },

    location:{
        type: DataTypes.STRING,
        allowNull: false
    },


}, {timestamps: true})


module.exports = Project