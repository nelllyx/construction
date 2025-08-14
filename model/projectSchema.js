const {DataTypes}  = require('sequelize')
const sequelize = require('../config/database')
const AppError = require("../exceptions/AppError");

const Project = sequelize.define('Project',{

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    title:{
        type: DataTypes.STRING,
        allowNull: false
    },

    description:{
        type: DataTypes.TEXT,
        allowNull: false
    },

    location:{
        type: DataTypes.STRING,
        allowNull: false
    },

    homeownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },

}, { timestamps: true,
    hooks: {
        beforeCreate: (async (project, options) => {
            const existingProject = await Project.findOne({
                where: {
                    homeownerId: project.homeownerId,
                    title: project.title
                }
            });
            if (existingProject) throw new AppError('A project with this name already exists for this homeowner.', 400);

        })

    }
})

Project.associate = (models) => {
    // A Project belongs to a Homeowner
    Project.belongsTo(models.User, {
        foreignKey: 'homeownerId',
        as: 'homeowner',
    });

    // A Project can have many Bids (from Contractors)
    Project.hasMany(models.Bid, {
        foreignKey: 'projectId',
        as: 'bids',
    });

    // A Project can have many Milestones
    Project.hasMany(models.Milestone, {
        foreignKey: 'projectId',
        as: 'milestones',
    });
};



module.exports = Project