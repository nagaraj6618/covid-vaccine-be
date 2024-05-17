const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
  name: {
   type:String,
   unique:true,
   required:true
  },

  phone: {
   type:String,
   required:true
  },

  email: {
   type:String,
   required:true
   
  },

  openingHours: {
    type:String,
    default:"Every Day 10:00AM to 4:00PM"
  },

  capacityPerDay: {
   type:Number,
   
   default:10
  },
  patientId:Array,
  address:{
      place:String,
      city:String,
      pincode:String,
      state:String,
   },

   dosageCount:{
      required:true,
      type:String,
   },
   status:{
      type:Boolean,
      default:true,
   },
});

module.exports = mongoose.model('center',centerSchema);