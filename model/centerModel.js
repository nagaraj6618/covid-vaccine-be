const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
  name: {
   type:String,
   required:true
  },

  phone: {
   type:String,
   unique:true,
   required:true,
  },

  email: {
   type:String,
   
   unique:true,
   required:true,
  },

  openingHours: {
    type:String,
    default:"Every Day 10:00AM to 4:00PM"
  },

  capacityPerDay: {
   type:Number,
   required:true,
   default:10
  },
  
  patientId:Array,

  address:{
      type:String,
      required:true
   },

   dosageCount:{
      type:Number,
      required:true,
   }
});

module.exports = mongoose.model('center',centerSchema);