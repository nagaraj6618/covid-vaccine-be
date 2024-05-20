const patientModel = require('../model/patientMode');
const { sendOTPVerificationEmail } = require('./authController');
const OTPModel = require('../model/OTPModel');
const userModel = require('../model/userModel')
const bcrypt = require('bcrypt');
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
      const {status} = req.body;
      const getPatientData = await patientModel.findById(id);
      const getUserDetails = await userModel.findById(getPatientData.userId);
      const dataToSendEmail = {
         _id:id,
         email:getUserDetails.email
      }
      console.log(getUserDetails)
      // const isAlreadyUpdated = getPatientData.vaccineDetails.status;
      // if(isAlreadyUpdated){
      //    return res.status(400).json({
      //       success:false,
      //       message:'Already Updated patient data',
      //       data:getPatientData
      //    });
      // };
      // console.log(getPatientData.vaccineDetails.status)
      const salt = bcrypt.genSaltSync(10);
      await sendOTPVerificationEmail(dataToSendEmail , salt,res)
      // const updatePatientDetails = await patientModel.findByIdAndUpdate(id,{
      //    vaccineDetails:{
      //       date:Date.now(),
      //       status:status
      //    }
      // });
      // console.log(updatePatientDetails);
      // res.status(200).json({
      //    success:true,
      //    message:'Patient details updated successfully',
      //    data:updatePatientDetails
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

async function updatePatientVaccineStatusOtpVerification (req,res){


   try{
     
      const id = req.params.id;
      console.log(req.body,id);
      const {otp} = req.body;
      console.log("otp:",otp);
      const userOTPVerificationRecords = await OTPModel.find({userId:id});
      console.log(userOTPVerificationRecords)
      if(userOTPVerificationRecords.length<=0){
         return res.status(400).json({success:false,message:"OTP doesn't exist"});
      }
      const {expiresAt} = userOTPVerificationRecords[0];
      const hashOtp = userOTPVerificationRecords[0].otp;
      
      if(expiresAt < Date.now()){
         await OTPModel.deleteMany({userId:id});
         
         return res.status(200).json({message:'Code expired',success:false});
         
      }
     
      else{
         
         const isOtpValid = await bcrypt.compareSync(otp,hashOtp);
         
         if(!isOtpValid){
            return res.status(400).json({success:false,message:'OTP is not valid'});
         }
         const getPatientData = await patientModel.findById(id);
         if(getPatientData.vaccineDetails.status){
            return res.status(200).json({
               success:true,
               message:'patien vaccinate status alredy updated',
               data:getPatientData
            })
         }
         const updatePatientDetails = await patientModel.findByIdAndUpdate(id,{vaccineDetails:{
            name:getPatientData.vaccineDetails.name,
            dosageCount:getPatientData.vaccineDetails.dosageCount,
            status:true,
            date:Date.now()
            
         }})
         // const updateUserData = await userModelSchema.updateOne({_id:id},{verified:true});
         await OTPModel.deleteMany({userId:id});
         return res.status(200).json({success:true,message:'OTP verification Successfull',data:updatePatientDetails})
      }
      
   }
   catch(error){
      res.status(500).json({success:false,error:error,message:'Internal Server Error'})
   }
   
}

async function getPatientDetailsByUserId(req,res){
   try{
      const {id} = req.params;
      const getPatientDataByUserId = await patientModel.find({
         userId:id
      });
      console.log(getPatientDataByUserId);
      
      res.status(200).json({
         success:true,
         message:'Get patient details by user id',
         data:getPatientDataByUserId
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

module.exports = {updatePatientDetails,getAllPatientDetails,getPatientDetailsById,getPatientDetailsByUserId,getPatientDetailsByCenterId,updatePatientVaccineStatusOtpVerification}