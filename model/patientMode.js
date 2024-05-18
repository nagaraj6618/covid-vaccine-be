const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
   patientDetails:{
      name:String,
      gender:String,
      aadharNumber:String,
      dob:Date,
      email:String,
      phone:String,
   },
   vaccineDetails:{
      name:String,
      dosageCount:String,
      status:Boolean,
      date:{
         type:String,
         default:'nil'
      },
   },
   centerId:{
      type:String,
      required:true,
   },
   userId:{
      type:String,
      required:true
   }

})
module.exports = mongoose.model('patient',patientSchema);