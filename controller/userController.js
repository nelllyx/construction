const {createUser,verifyUserOtp, login, createProject,getProject,createBid,createMilestone, getProjectMilestone} = require('../services/userService')
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

    const userId = req.user.id

    if(!req.body){
        return next(new AppError("Request body can not be empty", 400))
    }

    const {title, description, location } = req.body

    if (!title || !location) {
        return next(new AppError('Title and location field required', 400));
    }

    const project = await createProject({homeownerId:userId , title, description, location})

    res.status(201).json({
        message: 'Project created successfully',
        data: project
    })


})

exports.getProject = catchAsync(async (req, res, next) => {

    const projectId = req.params.id;

    const Project = await getProject(projectId)

    if (!Project) {
        return res.status(404).json({
            status: 'fail',
            message: 'Project not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data:  Project
    });

})

exports.createBid = catchAsync(async (req, res, next) => {

    const contractorId = req.user.id

    if(!req.body){
        return next(new AppError("Request body can not be empty", 400))
    }

    const {projectId,price, duration} = req.body

    if (!price || !duration) {
        return next(new AppError('Every field is required', 400));
    }

    const Bid = await createBid(projectId,contractorId,price,duration)


    res.status(201).json({
        message: 'Bid created',
        data: Bid
    })

})

exports.createProjectMilestone = catchAsync(async (req, res, next) => {

    if(!req.body){
        return next(new AppError("Request body can not be empty", 400))
    }

    const {projectId, title,description,dueDate,status} = req.body

    const Milestone = await createMilestone({projectId, title, description, dueDate, status});

    res.status(201).json({
        message: 'Milestone created',
        data: Milestone
    })

})

exports.getProjectMilestone = catchAsync( async (req, res, next) => {

    const projectId = req.params.projectId;

    console.log(projectId)

    const ProjectMilestone = await getProjectMilestone(projectId)

    if (!ProjectMilestone) {
        return res.status(404).json({
            status: 'fail',
            message: 'Project milestone not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data:  ProjectMilestone
    });

})