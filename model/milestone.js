const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Milestone = sequelize.define('Milestone', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},

	title: {
		type: DataTypes.STRING,
		allowNull: false
	},

	description: {
		type: DataTypes.TEXT,
		allowNull: true
	},

	dueDate: {
		type: DataTypes.DATE,
		allowNull: true
	},

	status: {
		type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'released'),
		defaultValue: 'pending'
	},

	projectId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'Projects',
			key: 'id'
		},
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE'
	}
}, { timestamps: true })

Milestone.associate = (models) => {
	Milestone.belongsTo(models.Project, {
		foreignKey: 'projectId',
		as: 'project'
	})
}

module.exports = Milestone


