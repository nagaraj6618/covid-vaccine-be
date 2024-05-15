const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   name:{
      type:String,
      required:true,
   },
   userName:{
      type:String,
      required:true,
      unique:true,
   },

   email:{
      type:String,
      required:true,
      unique:true,
   },
   password:{
      type:String,
      required:true,
   },
   role:{
      type:String,
      default:'user',
   },
   createdAt:{
      type:String,
      required:true,
   }
})

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;