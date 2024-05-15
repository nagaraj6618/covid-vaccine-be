const axios = require('axios');
const bcrypt = require('bcrypt');
const userModelSchema = require('../model/userModel');

async function isEmailValid (email){
   try {
      const key = process.env.EMAIL_VALIDATE_API_KEY;
      const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${key}&email=${email}`);
      // console.log(response.data.deliverability)
      // console.log(response.data.deliverability == "DELIVERABLE")
      return response.data.deliverability == "DELIVERABLE"
   }
   catch (error) {
      return false;
   }
} 
const registerController = async(req,res) => {
   try{
      const {name,userName,password,email} = req.body;
      const isvalid = await isEmailValid(email);
      if(!isvalid){
         return res.status(404).json({success:false,message:'Email is not valid'});
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password,salt);

      const userData = {
         email:email,
         password:hashPassword,
         userName:userName,
         name:name,
         createdAt: new Date(Date.now())
      }
      
      const newUser = new userModelSchema(userData);
      await newUser.save();
      console.log(newUser);
      res.status(200).json({success:true,message:'Registered Successfully',data:newUser});

   }
   catch(error){
      res.status(500).json({success:false,message:'Internal Server Error',error:error});
   }
   
}

const loginController = (req,res) => {
   res.status(200).json({message:'Login Working',data:'Working'});
}

module.exports = {loginController,registerController}