const express = require('express');
const { addNewAppointment, getAllAppointment } = require('../controller/appointmentContoller');
const router = express.Router();


router.post('/',addNewAppointment);
router.get('/',getAllAppointment);

module.exports = router;