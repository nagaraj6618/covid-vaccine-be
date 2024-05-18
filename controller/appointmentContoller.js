const appointmentModel = require('../model/appointmentModel');
const patientModel = require('../model/patientMode');
const { verifyToken } = require('./authVerify');


// function calculateAge(dobString) {
//    const dob = new Date(dobString);
//    const today = new Date();
//    let age = today.getFullYear() - dob.getFullYear();
//    const monthDifference = today.getMonth() - dob.getMonth();
//    const dayDifference = today.getDate() - dob.getDate();
//    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
//        age--;
//    }
//    return age;
// }



async function addNewAppointment (req,res){

   try{
      const userDetailsFromToken = verifyToken(req.headers.authorization);
      console.log(userDetailsFromToken);
      if(!userDetailsFromToken){
         return res.status(200).json({success:false,message:'You are not valid user..'});
      }
      const {patientName,email,phone,dob,gender,aadharNumber,appointmentDate,bookedAt,centerId,vaccineName,dosage} = req.body;
      console.log(patientName,dob,gender,aadharNumber,appointmentDate,bookedAt,centerId,vaccineName,dosage);
      const getAppointmentData = await appointmentModel.find({appointmentDate:appointmentDate});
      if(getAppointmentData.length >=10){
         return res.status(200).json({success:false,message:'Maximum book reached per day'});
      }
      
      const addNewPatientData = await new patientModel({
         patientDetails:{
            name:patientName,
            gender:gender,
            aadharNumber:aadharNumber,
            dob:dob,
            email:email,
            phone:phone
         },
         vaccineDetails:{
            name:vaccineName,
            dosageCount:dosage,
            status:false,
         },
         centerId:centerId,
         userId:userDetailsFromToken.id,         
      })

      // console.log(appointmentData)
      if(!addNewPatientData){
         return res.status(400).json({success:false,message:'Problem in patient details..'});
      }
      const addNewAppointmentData = await new appointmentModel({
         patientId:addNewPatientData._id,
         centerId:centerId,
         userId:userDetailsFromToken.id,
         bookedAt: Date.now(),
         appointmentDate:appointmentDate
      })
      
      if(!addNewAppointmentData){
         return res.status(400).json({success:false,message:'Problem in appoinment booking'});
      }

      await addNewPatientData.save()
      await addNewAppointmentData.save();
      res.status(200).json({sucess:true,message:'Appointment made successful',data:{patientData:addNewPatientData,appointmentData:addNewAppointmentData}});
   }
   catch(error){
      res.status(500).json({success:false,message:'Booking was not successfull',error:error})
   }
   
}


module.exports = {addNewAppointment}