const express = require('express');
const { addNewVaccineCenter, updateVaccineCenter, getAllVaccineCenter, getVaccineById, deleteCenterById } = require('../controller/centerController');
const { verifyAdmin } = require('../controller/authVerify');
const router = express.Router();

router.get('/',getAllVaccineCenter);
router.get('/:id',getVaccineById)
router.post('/',verifyAdmin,addNewVaccineCenter);
router.put('/:id',verifyAdmin,updateVaccineCenter);
router.delete('/:id',verifyAdmin,deleteCenterById);
module.exports = router;