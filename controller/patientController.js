const patientModel = require('../model/patientMode');


async function getAllPatientDetails(req,res){
   try{
      const patientData = await patientModel.find();
   
      res.status(200).json({
         success:true,
         message:'Patient data retrived successfully',
         data:patientData,
      });
      
      // res.status(200).json({
      //    success:true,
      //    message:'Successfully retrived all the patient details',
      //    data:id
      // })
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
      res.status(200).json({
         success:true,
         message:'Patient details updated successfully',
         data:id
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
      res.status(200).json({
         success:true,
         message:'Get patient details by center id',
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

module.exports = {updatePatientDetails,getAllPatientDetails,getPatientDetailsById,getPatientDetailsByUserId,getPatientDetailsByCenterId}