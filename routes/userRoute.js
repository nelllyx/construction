const express = require('express');
const router = express.Router();
const {signup, otpVerification, login, createProject, getProjects} = require('../controller/userController');
const {protect,restrictTo} = require("../middleware/authMiddleware");


// Public routes
router.post('/signup', signup);
router.post('/verification', otpVerification)
router.post('/login', login)


// homeowner Protected Route

router.use(protect, restrictTo('homeOwner'));
router.post('/projects', createProject)
router.get('/projects/:id', getProjects)

module.exports = router;