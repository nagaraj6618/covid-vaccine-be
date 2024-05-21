const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
   patientId:{
      type:String,
      require:true,
   },
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
      default:'scheduled'
   },
   appointmentDate:{
      type:String,
      required:true,
   },
})

module.exports = mongoose.model('appointment',appointmentSchema);