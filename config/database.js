//const {Pool} = require('pg')
const {Sequelize} = require('sequelize')
const dotenv = require("dotenv");
// dotenv.config({path: './config.env'})
const catchAsync = require('../middleware/catchAsync')

 dotenv.config({ path: './config.env' });

const sequelize = new Sequelize ({
    database:  process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "postgres",
})

// Test connection when needed, not on module load
// catchAsync( async ()=>{
//     await sequelize.authenticate()
//     console.log('PostgreSQL connection established successfully.');
// })


module.exports = sequelize