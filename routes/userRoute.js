const express = require('express');
const router = express.Router();
const {signup, verifyOtp} = require('../controller/userController');


// Public routes
router.post('/signup', signup);
router.post('/verification', verifyOtp)

module.exports = router;