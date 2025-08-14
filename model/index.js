const sequelize = require("../config/database")
const User = require("./userSchema")
const Project = require("./projectSchema")
const Bid = require("./bidSchema")
const Milestone = require("./milestone")

const models = {
    User,
    Project,
    Bid,
    Milestone,
};

// Set up associations
Object.values(models).forEach(model => {
    if (model.associate) {
        model.associate(models);
    }
});

module.exports = {
    sequelize,
    ...models,
};

