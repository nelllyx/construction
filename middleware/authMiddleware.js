const catchAsync = require("./catchAsync");
const AppError = require("../exceptions/AppError");
const jwt = require("jsonwebtoken");


exports.protect = catchAsync(async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new AppError('Please login to gain access', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id || !decoded.role) {
            new AppError('Invalid token format', 401);
        }

        req.user = await exports.getUserByIdAndRole(decoded.id, decoded.role);
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid token. Please login again', 401);
        }
        if (error.name === 'TokenExpiredError') {
            throw new AppError('Your token has expired. Please login again', 401);
        }
        throw error;
    }
});

exports.restrictTo = (...roles)=>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.role)){
            throw new AppError('You do not have permission to perform this action', 403)
        }



        next()
    }

}