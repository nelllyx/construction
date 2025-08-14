const userRepository = require('../repository/userRepository')
const bidRepository = require('../repository/bidRepository')
const AppError = require('../exceptions/AppError')
const {generateUserOtp, otpVerification, signUpToken} = require('../services/authenticationService')
const projectRepository = require('../repository/projectRepository')

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

    return  await projectRepository.create(projectData)

}

exports.getProject = async (projectId) => {

    const project = await projectRepository.findProjectById(projectId)

    if(!project) throw new AppError("Project not found", 401)

    return project;

}

exports.createBid = async (projectId, contractorId, price, duration) => {

  return   bidRepository.findOrCreateBid(projectId, contractorId, price, duration)


}


