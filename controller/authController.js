const axios = require('axios');
const bcrypt = require('bcrypt');
const userModelSchema = require('../model/userModel');
const OTPModel = require('../model/OTPModel');
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
      user: 'nagaraj516700@gmail.com',
      pass: 'bgxm fbbf gofe rlbp'
   }
})



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

      //check email is valid
      // const isvalid = await isEmailValid(email);
      // if(!isvalid){
      //    return res.status(404).json({success:false,message:'Email is not valid'});
      // }

      //check user is already exists
      const isAlreadyUser = await userModelSchema.find({email:email});
      if(isAlreadyUser.length>0){
         return res.status(400).json({success:false,message:"User Already exist"});
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
      sendOTPVerificationEmail(newUser,salt,res);
      res.status(200).json({success:true,message:'Registered Successfully',data:newUser});

   }
   catch(error){
      res.status(500).json({success:false,message:'Internal Server Error',error:error});
   }
   
}

const loginController = (req,res) => {
   res.status(200).json({message:'Login Working',data:'Working'});
}

const OTPVerification = async(req,res) => {
   try{
      console.log(req.body);
      const id = req.params.id;
      const {otp} = req.body;
      
      const userOTPVerificationRecords = await OTPModel.find({userId:id});
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
         const updateUserData = await userModelSchema.updateOne({_id:id},{verified:true});
         await OTPModel.deleteMany({userId:id});
         return res.status(200).json({success:true,message:'OTP verification Successfull',data:updateUserData})
      }
      
   }
   catch(error){
      res.status(500).json({success:false,error:error,message:'Internal Server Error'})
   }
   

}


async function sendOTPVerificationEmail({_id,email},salt,res){

   try{
      console.log(_id,email)
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const OTPMailOption = {
         from: process.env.AUTH_EMAIL,
         to: email,
         subject: "Your OTP Code for Verification",
         html: `
             <p>Dear User,</p>
             <p>Thank you for registering with Covid Vaccine.</p>
             <p>Your OTP code for verification is:</p>
             <h2>${otp}</h2>
             <p>Please enter this code to complete your verification process. The code is valid for 10 minutes.</p>
             <p>If you did not request this code, please ignore this email.</p>
             <p>Best regards,<br>Covid Vaccine</p>
         `
     };
     const hashOtp = bcrypt.hashSync(otp,salt);
     const newOTPVerfication = new OTPModel({
      otp:hashOtp,
      userId:_id,
      createdAt: new Date(Date.now()),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
     })
     console.log(newOTPVerfication)
     await newOTPVerfication.save();
     await transporter.sendMail(OTPMailOption, function (error, info) {
      if (error) {
         console.error('Error sending email:', error);
         return res.status(400).json({success:false,message:error})
      } else {
         console.log('Email sent:', info.response);
         return res.status(200).json({success:true,message:'Verification otp email sent',data:{
            id:_id,
            email:email
         }
      })
      }
   });
     console.log(newOTPVerfication);
   }
catch(error){
   return res.status(500).json({success:false,message:error.message});
}
}
module.exports = {loginController,registerController,OTPVerification}