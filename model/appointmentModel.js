const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

   centerId:{
      type:String,
      required:true
   },

   userId:{
      type:String,
      required:true
   },

   bookedAt:Date,

   status:{
      type:String,
      default:'pending'
   },
   appointmentDate:{
      type:String,
      required:true,
   },
   appointmentTime:{
      type:String,
      required:true
   },

   patientDetails:{
      name:String,
      gender:String,
      aadharNumber:String,
   },


})

module.exports = mongoose.model('appointment',appointmentSchema);