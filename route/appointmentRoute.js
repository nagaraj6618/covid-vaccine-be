const express = require('express');
const { 
      addNewAppointment, 
      getAllAppointment, 
      getAppointmentById, 
      updateAppointmentById, 
      getAllAppointmentByUserId
   } = require('../controller/appointmentContoller');
const { verifyUser, verifyAdmin } = require('../controller/authVerify');
   
const router = express.Router();


router.post('/',verifyUser,addNewAppointment);
router.get('/',verifyAdmin,getAllAppointment);
router.get('/user',verifyUser,getAllAppointmentByUserId);

router.get('/:id',verifyAdmin,getAppointmentById);
router.put('/:id',verifyAdmin,updateAppointmentById);

module.exports = router;