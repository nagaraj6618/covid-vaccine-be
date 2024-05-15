const express = require('express');
const router = express.Router();
const {loginController, registerController, OTPVerification} = require('../controller/authController');
router.get('/' , loginController);

router.post('/signup',registerController);
router.post('/otp-verify/:id',OTPVerification)
module.exports = router;