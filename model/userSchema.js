const {DataTypes}  = require('sequelize')
const bcrypt = require('bcrypt');

const sequelize = require('../config/database')
const userRoles = require("../config/UserRoles");

const User = sequelize.define('User', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    firstName:{
        type: DataTypes.STRING,
        allowNull: false
    },

   lastName:{
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail:{
                msg: "Please provide a valid email address",
            } },
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        minLength: 8
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: {
                args: /^[+]?[0-9][\d]{0,11}$/,
                msg: "Please provide a valid phone number",
            },
        },
    },

    gender:{
        type: DataTypes.STRING,
        enum: ['male', 'female'],
        allowNull: false
    },

    role: {
        type: DataTypes.STRING,
        enum: Object.values(userRoles),
        allowNull: false
    },

    isVerified:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    otp:{
        type: DataTypes.STRING,
        defaultValue: null
    },

    otpCreationTime:{
        type: DataTypes.DATE,
        allowNull: true,
        default: null
    },

    passwordChangedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    tableName: 'Users',
    timestamps:true,

    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },

        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                user.passwordChangedAt = new Date(Date.now() - 1000);
            }
        },
    }


})

User.prototype.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.otp;
    return values;
};

module.exports = User