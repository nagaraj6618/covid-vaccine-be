const express = require('express');
const router = express.Router();
const {loginController, registerController, OTPVerification, resetPassword} = require('../controller/authController');
router.post('/signin' , loginController);
router.post('/reset-password',resetPassword)
router.post('/signup',registerController);
router.post('/otp-verify/:id',OTPVerification)
module.exports = router;