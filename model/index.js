const User = require('./userSchema')
const Project = require('./projectSchema')




// One client can post many projects
User.hasMany(Project, { foreignKey: "homeOwnerId", as: "projects" });
Project.belongsTo(User, { foreignKey: "contractorId", as: "client" });