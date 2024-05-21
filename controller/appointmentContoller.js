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

async function getAllAppointment(req, res) {

   try {
      const status = req.query.status;
      const date = req.query.date;
      console.log(status,date);
      
      if (!status && !date) {
         const getAllAppointmentData = await appointmentModel.find();
         return res.status(200).json(
            { 
               success: true,
               message: 'Retrived all the appointment', 
               data: getAllAppointmentData 
            });
      }
      else if (status && !date) {
         const getAppointmentDataBasedOnStatus = await appointmentModel.find(
            {
               status: status.toLowerCase()
            });
         return res.status(200).json(
            {
                success: true, 
                message: `Retrive the appointment data based on the ${status}`, 
                data: getAppointmentDataBasedOnStatus 
            });
      }
      else if (date && !status) {
         const getAppointmentDataBasedOnDate = await appointmentModel.find({ 
            appointmentDate: date 
         });
         return res.status(200).json({ 
            success: true,
            message: `Retrive the appointment data based on the ${status}`,
            data: getAppointmentDataBasedOnDate
         });
      }
      const getAllAppointmentBasedOnStatusAndDate = await appointmentModel.find(
         {
            status: status.toLowerCase(),
            appointmentDate: date
         })
      return res.status(200).json({ 
         success: true, 
         message: `Retrive the appointment data based on the ${status} and ${date}`, 
         data: getAllAppointmentBasedOnStatusAndDate 
      });
      
   }
   catch (error) {
      res.status(500).json({ 
         status: false, 
         message: 'Error while retriving the appointments data', 
         error: error 
      })
   }
}


async function addNewAppointment(req, res) {

   try {
      const userDetailsFromToken = verifyToken(req.headers.authorization);
      console.log(userDetailsFromToken);
      if (!userDetailsFromToken) {
         return res.status(400).json({ 
            success: false, 
            message: 'You are not valid user..' 
         });
      }
      const { patientName, email, phone, dob, gender, aadharNumber, appointmentDate, bookedAt, centerId, vaccineName, dosage } = req.body;
      console.log(patientName, dob, gender, aadharNumber, appointmentDate, bookedAt, centerId, vaccineName, dosage);
      
      const today = new Date(Date.now());
      const appointmentBookingDate = new Date(appointmentDate);
      if(appointmentBookingDate < today){
         return res.status(200).json({
            success:false,
            message:`We're sorry,you cannot able to book past.Please select another date`,

         })
      }
      
      const getAppointmentData = await appointmentModel.find({ appointmentDate: appointmentDate });
      if (getAppointmentData.length >= 10) {
         return res.status(400).json({ 
            success: false, 
            message:`We're sorry, but all appointment slots are fully booked on ${appointmentDate}. Please select a different date or try again later.` });
      }
      const existingPatient = await patientModel.findOne({
         $and: [
            { 'patientDetails.aadharNumber': aadharNumber },
            { 'vaccineDetails.name': vaccineName },
            { 'vaccineDetails.dosageCount': dosage }
         ]
      });

      if (existingPatient) {
         return res.status(400).json({
            success: false,
            message: 'Already Booked Check the Booking history'
         });
      }

      const addNewPatientData = await new patientModel({
         patientDetails: {
            name: patientName,
            gender: gender,
            aadharNumber: aadharNumber,
            dob: dob,
            email: email,
            phone: phone
         },
         vaccineDetails: {
            name: vaccineName,
            dosageCount: dosage,
            status: false,
         },
         centerId: centerId,
         userId: userDetailsFromToken.id,
      })

      // console.log(appointmentData)
      if (!addNewPatientData) {
         return res.status(400).json({ success: false, message: 'Problem in patient details..' });
      }
      const addNewAppointmentData = await new appointmentModel({
         patientId: addNewPatientData._id,
         centerId: centerId,
         userId: userDetailsFromToken.id,
         bookedAt: Date.now(),
         appointmentDate: appointmentDate
      })

      if (!addNewAppointmentData) {
         return res.status(400).json({ success: false, message: 'Problem in appoinment booking' });
      }

      await addNewPatientData.save();
      await addNewAppointmentData.save();

      res.status(200).json({ success: true, 
         message: 'Appointment made successful', 
         data: { 
            patientData: addNewPatientData, 
            appointmentData: addNewAppointmentData 
         } 
      });
   }
   catch (error) {
      res.status(500).json({ 
         success: false, 
         message: 'Booking was not successfull', 
         error: error 
      })
   }

}

async function getAppointmentById (req,res){
   try{

      const {id} = req.params;
      const appointmentDataById = await appointmentModel.findById(id);
      // console.log(appointmentDataById)
      if(!appointmentDataById){
         return res.status(404).json({
            success:false,
            message:"Appointment ID is not Valid",
            data:appointmentDataById,
         })
      }
      res.status(200).json({
         success:true,
         message:'Retrivied the Appointment details',
         data:appointmentDataById,
      })
   }
   catch(error){
      res.status(500).json({
         success:false,
         message:'Server Error while retriving the data',
         error:error
      })
   }
}

async function updateAppointmentById (req,res){
   try{
      const {id} = req.params;
      const {status} = req.body;
      const updateAppointmentData = await appointmentModel.findByIdAndUpdate(id,{status:status});
      res.status(200).json({
         success:true,
         message:'Status updated Successfully',
         data:updateAppointmentData
      })
   }
   catch(error){
      res.status(500).json({
         success:false,
         message:"server error while retriving the data",
         error:error,
      })
   }
}

//get all appointment by userId,
async function getAllAppointmentByUserId (req,res) {
   try{
      
      const userDetailsFromToken = verifyToken(req.headers.authorization);
      if(!userDetailsFromToken){
         return res.status(400).json({
            success:false,
            message:'You are not valid user',
         })
      }
      const {status,date} = req.query;
      if(userDetailsFromToken.role === 'admin'){
         getAllAppointment(req,res);
      }
      else{
      if(!status && !date){
         console.log("testiing");
         const appointmentData = await appointmentModel.find({userId:userDetailsFromToken.id});

         return res.status(200).json({
            success:true,
            message:'Retrived all the appointment of the user',
            data:appointmentData,
         })
      }
      else if(status && !date){
         console.log("Testing-2");
         const appointmentDataBasedOnStatusAndUserId = await appointmentModel.find({
            userId:userDetailsFromToken.id,
            status:status.toLowerCase()
         })
         return res.status(200).json({
            success:true,
            message:'Successfull',
            data:appointmentDataBasedOnStatusAndUserId
         })
      }
      else if(!status && date){
         console.log("Testing-3",date);
         const appointmentDataBasedOnDateAndUserId = await appointmentModel.find({
            userId:userDetailsFromToken.id,
            appointmentDate:date
         })
         return res.status(200).json({
            success:true,
            message:'Successfull',
            data:appointmentDataBasedOnDateAndUserId
         })
      }
      const appointmentData = await appointmentModel.find({
         userId:userDetailsFromToken.id,
         appointmentDate:date,
         status:status
      });
      // console.log(userDetailsFromToken);
      res.status(200).json({
         success:true,
         message:'Retrived all the appointment of the user',
         data:appointmentData,
      })
   }
   }
   catch(error){
      res.status(500).json({
         success:false,
         message:"server error while retriving the data",
         error:error,
      })
   }
   
}

module.exports = { addNewAppointment, getAllAppointment,getAppointmentById,updateAppointmentById ,getAllAppointmentByUserId}