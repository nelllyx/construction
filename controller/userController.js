const {createUser,verifyUserOtp, login, createProject} = require('../services/userService')
const AppError = require('../exceptions/AppError')
const catchAsync = require('../middleware/catchAsync')
const userRoles = require("../config/UserRoles");



exports.signup = catchAsync( async (req, res, next) => {

    if(!req.body){
        return next(new AppError("Request body can not be empty", 400))
    }


    if (!Object.values(userRoles).includes(req.body.role)) {
        return next(new AppError("Invalid role", 400))
    }

    const User = await createUser(req.body)

    res.status(201).json({
        message: "Registration successful",
        data: User
    })

})

exports.otpVerification = catchAsync( async (req, res, next) =>{

    if(!req.body){
        return next(new AppError("Request body can not be empty", 400))
    }

    const {id, otp } = req.body

    if (!id || !otp) {
        return next(new AppError('Please provide id, and otp', 400));
    }

    const token = await verifyUserOtp(id, otp)


    res.status(200).json({
        status: 'success',
        token,
    })


})

exports.login = catchAsync(async (req, res, next) =>{

    if(!req.body){
        return next(new AppError("Request body can not be empty", 400))
    }

    const {email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Email and password required', 400));
    }

    const token = await login(email, password)

    res.status(200).json({
        token
    })


})

exports.createProject = catchAsync( async (req, res, next) => {

    if(!req.body){
        return next(new AppError("Request body can not be empty", 400))
    }

    const {tittle, description, location, } = req.body

    if (!tittle || !description || !location) {
        return next(new AppError('Every field is required', 400));
    }

    const project = await createProject(req.body)

    res.status(201).json({
        message: 'Project created successfully',
        project
    })


})

exports.getProject = catchAsync(async (req, res, next) => {
    
})