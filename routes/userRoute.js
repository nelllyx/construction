const express = require('express');
const router = express.Router();
const {signup, otpVerification, login, createProject, getProject, createBid,createProjectMilestone,getProjectMilestone} = require('../controller/userController');
const {protect,restrictTo} = require("../middleware/authMiddleware");
const bidValidation = require("../validators/bidValidation")
const milestoneValidation = require("../validators/milestoneValidation")
const projectValidation = require("../validators/projectValidation")
const validate = require("../middleware/validationMiddleware")

// Public routes
router.post('/signup', signup);
router.post('/verification', otpVerification)
router.post('/login', login)


//Protected Routes
router.use(protect);
router.post('/projects', ...projectValidation, validate, restrictTo('house_owner'),createProject)
router.get('/projects/:id', getProject)
router.post('/bids', ...bidValidation, validate, restrictTo('contractor') ,createBid)
router.post('/project/milestone', ...milestoneValidation, validate, restrictTo('project_manager'),createProjectMilestone )
router.get('/milestones/:projectId', getProjectMilestone)
module.exports = router;