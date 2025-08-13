const userRepository = require('../repository/userRepository')
const bidRepository = require('../repository/bidRepository')
const AppError = require('../exceptions/AppError')
const {generateUserOtp, otpVerification, signUpToken} = require('../services/authenticationService')


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

exports.login = async (email, password) => {

    const user = await userRepository.findByEmail(email)

    if(!user || ( ! await user.correctPassword(password))) return (new AppError('Invalid login credentials', 400));


    // Check if user is verified
    if (!user.isVerified) {
        return (new AppError('Please complete your email verification', 401));
    }

    // Generate token
    return signUpToken(user.id, user.role);

}

exports.createProject = async (projectData)=>{

    return  await userRepository.create(projectData)

}

exports.getProject = async (projectId) => {

    const project = await userRepository.findProjectById(projectId)

    if(!project) throw new AppError("No available project", 401)

    return project;

}

exports.createBid = async (projectId, contractorId, price, duration) => {

    const [bid, created] = bidRepository.findOrCreateBid(projectId, contractorId, price, duration)

    if(!created){
        await bidRepository.updateBid(price, duration)

        return `Bid updated. ${bid} `;
    }



}


