const dotenv = require("dotenv");
const express = require('express')
const sequelize = require('./config/database')
const cors = require('cors');
const catchAsync = require("./middleware/catchAsync")
const userRoutes = require('./routes/userRoute')
const AppError = require("./exceptions/AppError");

// Initialize models and associations
const models = require('./model');

Object.values(models).forEach(model => {
    if (model.associate) {
        model.associate(models);
    }
});



const dotenvConfig = dotenv.config({ path: './config.env' });

if (dotenvConfig.error) {
    console.warn('⚠️ Could not load .env file:', dotenvConfig.error);
}

const constructionApplication = express()

constructionApplication.use(express.json())
constructionApplication.use(cors())



sequelize.sync({ force: false , alter: true})
    .then(() => console.log('Models synced with PostgreSQL!'))
    .catch(err => console.error('Sync failed:', err));



constructionApplication.use('/api/user', userRoutes)


//Testing Postgres connection
constructionApplication.get('/test-db', catchAsync(
    async (req, res) => {

        await sequelize.authenticate();

        res.send({
            success: true,
            message: 'Database connection successful!',
        })
    }))


// 404 handler for unmatched routes
constructionApplication.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// Global error handling middleware
constructionApplication.use((err, req, res, next) => {
    // Ensure we have a valid status code
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    // Log the error for debugging
    console.error('Error details:', {
        message: err.message,
        statusCode: statusCode,
        stack: err.stack
    });

    if (process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({
            status: status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production mode
        if (err.isOperational) {
            res.status(statusCode).json({
                status: status,
                message: err.message
            });
        } else {
            // Programming or unknown errors
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!'
            });
        }
    }
});


// Start server
const port = process.env.PORT || 3001
constructionApplication.listen(port, () => {
    console.log(`App running on port ${port}...`)
})