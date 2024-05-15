const express = require('express');
const router = express.Router();
const {loginController, registerController} = require('../controller/authController');
router.get('/' , loginController);

router.post('/signup',registerController);

module.exports = router;