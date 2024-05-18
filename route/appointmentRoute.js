const express = require('express');
const { addNewAppointment } = require('../controller/appointmentContoller');
const router = express.Router();


router.post('/',addNewAppointment);


module.exports = router;