const express = require('express');
const router = express.Router();
const {signup, otpVerification, login, createProject, getProject, createBid} = require('../controller/userController');
const {protect,restrictTo} = require("../middleware/authMiddleware");


// Public routes
router.post('/signup', signup);
router.post('/verification', otpVerification)
router.post('/login', login)


//Protected Routes
router.use(protect);
router.post('/projects', restrictTo('house_owner'),createProject)
router.get('/projects/:id', getProject)
router.post('/bids', restrictTo('contractor') ,createBid)
module.exports = router;