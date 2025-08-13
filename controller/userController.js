const {createUser,verifyUserOtp} = require('../services/userService')
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

    const token = verifyUserOtp(id, otp)

    res.status(200).json({
        status: 'success',
        token,
    })


})