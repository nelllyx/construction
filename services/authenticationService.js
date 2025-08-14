const AppError = require("../exceptions/AppError");
const catchAsync = require("../middleware/catchAsync")
const jwt = require('jsonwebtoken')
const crypto = require("crypto");
const userRoles = require("../config/UserRoles");
const userRepository = require('../repository/userRepository')


exports.signUpToken = (id, role) => {

    if (!id || !role) {
        throw new AppError('Invalid token data', 400);
    }

    if (!Object.values(userRoles).includes(role)) {
        throw new AppError('Invalid role for token', 400);
    }

    return jwt.sign(
        {
            id: id.toString(),
            role: role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
}

exports.generateUserOtp = catchAsync (async  (Model) => {

    const otpCreatedAt = Date.now()

    const uniqueDigits = new Set();

    while (uniqueDigits.size < 6) {
        // Generate a random byte and take its value modulo 10
        const randomByte = crypto.randomBytes(1)[0];
        const digit = randomByte % 10;
        uniqueDigits.add(digit);
    }

    Model.otp = Array.from(uniqueDigits).join('')
    Model.otpCreationTime = otpCreatedAt

    await Model.save()

    return true

})

exports.sendOtpToUserEmail = (email, otp, name) =>{
    // Email functionality temporarily disabled
    // TODO: Implement email service
    console.log(`OTP for ${name} (${email}): ${otp}`);
    
    return {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: `🔑 Your OTP for Construction API – Expires in 15 minutes!`,
        html: `<p>Your OTP is: <strong>${otp}</strong></p>`
    }
}

exports.otpVerification = async (userId, otp) => {

    const currentTime = Date.now();
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (!user.otp || !user.otpCreationTime) {
        throw new AppError('OTP not generated or already used.', 404);
    }

    const timeDifference = currentTime - user.otpCreationTime.getTime();
    const fifteenMinutes = 15 * 60 * 1000;

    if (timeDifference > fifteenMinutes) {
        user.otp = null;
        user.otpCreationTime = null;
        await user.save();
        throw new AppError('OTP has expired. Please request for a new one.', 400);
    }

    const realOtp = user.otp;
    if (realOtp !== otp) {
        throw new AppError("Invalid OTP", 400);
    }

    user.isVerified = true;
    user.otp = null;
    user.otpCreationTime = null;
    await user.save();

    // Ensure we have both id and role before generating token
    if (!user.id || !user.role) {
        throw new AppError('Invalid user data for token generation', 500);
    }

    // Log the values being passed to signUpToken for debugging
    // console.log('Token generation data:', {
    //     id: user._id.toString(),
    //     role: user.role
    // });

    return exports.signUpToken(user.id, user.role);
}

exports.getUserByIdAndRole = async (id, role) => {

    let user;

    // Validate role
    if (!role || !Object.values(userRoles).includes(role)) {
        throw new AppError('Invalid user role', 400);
    }

  user = await userRepository.findUserByIdAndRole(id,role)

    if (!user) {
        throw new AppError('User not found', 404);
    }
    return user;
}




