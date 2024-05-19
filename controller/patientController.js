const patientModel = require('../model/patientMode');


async function getAllPatientDetails(req,res){
   try{
      const patientData = await patientModel.find();
   
      res.status(200).json({
         success:true,
         message:'Patient data retrived successfully',
         data:patientData,
      });

   }
   catch(error){
      res.status(500).json({
         success:false,
         message:'Patient updation failed',
         error:error,
      })
   }
}
async function getPatientDetailsById(req,res){
   try{
      const {id} = req.params;
      const patientData = await patientModel.findById(id);
      res.status(200).json({
         success:true,
         message:'Successfully retrived all the patient details',
         data:patientData
      })
   }
   catch(error){
      res.status(500).json({
         success:false,
         message:error.message,
         error:error,
      })
   }
}
async function updatePatientDetails (req,res){
   try{
      const {id} = req.params;
      const getPatientData = await patientModel.findById(id);
      const isAlreadyUpdated = getPatientData.vaccineDetails.status;
      if(isAlreadyUpdated){
         return res.status(400).json({
            success:false,
            message:'Already Updated patient data',
            data:getPatientData
         });
      };
      console.log(getPatientData.vaccineDetails.status)
      const updatePatientDetails = await patientModel.findByIdAndUpdate(id,{
         vaccineDetails:{
            date:Date.now(),
            status:true
         }
      });
      console.log(updatePatientDetails);
      res.status(200).json({
         success:true,
         message:'Patient details updated successfully',
         data:updatePatientDetails
      })
   }
   catch(error){
      res.status(500).json({
         success:false,
         message:'Patient updation failed',
         error:error,
      })
   }
}

async function getPatientDetailsByUserId(req,res){
   try{
      const {id} = req.params;
      res.status(200).json({
         success:true,
         message:'Get patient details by user id',
         data:id
      })
   }
   catch(error){
      res.status(500).json({
         success:false,
         message:'No record found',
         error:error,
      })
   }
}

async function getPatientDetailsByCenterId(req,res){
   try{
      const {id} = req.params;
      // console.log(id)
      const getPatientDataByCenter = await patientModel.find({
         centerId:id
      })
      // console.log(getPatientDataByCenter)
      res.status(200).json({
         success:true,
         message:'Get patient details by center id',
         data:getPatientDataByCenter
      })
   }
   catch(error){
      res.status(500).json({
         success:false,
         message:'No record found',
         error:error,
      })
   }
}

module.exports = {updatePatientDetails,getAllPatientDetails,getPatientDetailsById,getPatientDetailsByUserId,getPatientDetailsByCenterId}