const express = require('express');
const { addNewAppointment, getAllAppointment, getAppointmentById } = require('../controller/appointmentContoller');
const router = express.Router();


router.post('/',addNewAppointment);
router.get('/',getAllAppointment);
router.get('/:id',getAppointmentById);

module.exports = router;