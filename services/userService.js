const userRepository = require('../repository/userRepository')
const AppError = require('../exceptions/AppError')
const {generateUserOtp, otpVerification} = require('../services/authenticationService')


exports.createUser = async (userData) => {

    const existingUser = await userRepository.findByEmail(userData.email)

    if(existingUser) throw new AppError("User already exist", 401)

    const newUser = await userRepository.create(userData)

    await generateUserOtp(newUser)

    return newUser;

}

exports.verifyUserOtp = async(otp, userId) => {

    return await otpVerification(otp, userId);

}




