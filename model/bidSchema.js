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

    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
    },
    
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Projects',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },

    contractorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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