const express = require('express');
const { updatePatientDetails, getAllPatientDetails, getPatientDetailsById, getPatientDetailsByCenterId, getPatientDetailsByUserId } = require('../controller/patientController');
const { verifyAdmin, verifyUser } = require('../controller/authVerify');
const router = express.Router();

router.get('/',verifyAdmin,getAllPatientDetails);
router.get('/center/:id',getPatientDetailsByCenterId);
router.get('/user/:id',getPatientDetailsByUserId);

router.get('/:id',verifyUser,getPatientDetailsById);
router.post('/:id',updatePatientDetails);


module.exports = router;