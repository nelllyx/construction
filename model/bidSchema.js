const {DataTypes}  = require('sequelize')
const sequelize = require('../config/database')

const Bid = sequelize.define('Bid',{

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    price:{
        type: DataTypes.INTEGER,
        allowNull: false
    },

    duration:{
        type: DataTypes.STRING,
        allowNull: false
    },

    location:{
        type: DataTypes.STRING,
        allowNull: false
    },


}, {timestamps: true})

Bid.associate = (models) => {
    // A Bid belongs to a Project
    Bid.belongsTo(models.Project, {
        foreignKey: 'projectId',
        as: 'project',
    });

    // A Bid belongs to a Contractor (User)
    Bid.belongsTo(models.User, {
        foreignKey: 'contractorId',
        as: 'contractor',
    });
};

module.exports = Bid