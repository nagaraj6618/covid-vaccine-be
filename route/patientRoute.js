const express = require('express');
const { 
      updatePatientDetails, 
      getAllPatientDetails, 
      getPatientDetailsById, 
      getPatientDetailsByCenterId, 
      getPatientDetailsByUserId, 
      updatePatientVaccineStatusOtpVerification
   } = require('../controller/patientController');
const { verifyAdmin, verifyUser } = require('../controller/authVerify');
const router = express.Router();

router.get('/',verifyAdmin,getAllPatientDetails);
router.get('/center/:id',verifyAdmin,getPatientDetailsByCenterId);
router.get('/user/:id',verifyUser,getPatientDetailsByUserId);

router.post('/otp-verify/:id',updatePatientVaccineStatusOtpVerification)
router.get('/:id',verifyUser,getPatientDetailsById);
router.put('/:id',verifyAdmin,updatePatientDetails);


module.exports = router;