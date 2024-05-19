const express = require('express');
const { updatePatientDetails, getAllPatientDetails, getPatientDetailsById, getPatientDetailsByCenterId, getPatientDetailsByUserId } = require('../controller/patientController');
const router = express.Router();

router.get('/',getAllPatientDetails);
router.get('/center/:id',getPatientDetailsByCenterId);
router.get('/user/:id',getPatientDetailsByUserId);

router.get('/:id',getPatientDetailsById);
router.post('/:id',updatePatientDetails);


module.exports = router;