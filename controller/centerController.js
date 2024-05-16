const centerModel = require('../model/centerModel');

const getAllVaccineCenter = async(req,res) => {
   try{
      const allVaccineCenter = await centerModel.find();
      return res.status(200).json({success:true,message:'Retrived all the centers successfully',data:allVaccineCenter});
   }
   catch(error){
      return res.status(500).json({success:false,message:'Error while retriving the centers',error:error});
   }
}
const getVaccineCenterById = async(req,res) => {
   try{
      const id = req.params.id;

      const vaccineCenter = await centerModel.findById(id);
      console.log(vaccineCenter);
      return res.status(200).json({success:true,message:'Retrived Center Successfully',data:vaccineCenter})
   }
   catch(error){
      return res.status(500).json({success:false,message:'Error while retriving the center',error:error});
   }
}

const addNewVaccineCenter = async(req ,res) => {

   console.log(req.body);
   const {name,email,phone,address,dosageCount} = req.body;
   // res.status(200).json({message:"working",data:{name,email,phone,address,dosageCount}})
   try{
      // console.log(req.body);
      const centerData = {
         name:name,
         email:email,
         phone:phone,
         address:address,
         dosageCount:dosageCount
      }
      // console.log(centerData)
      const newCenterData = await new centerModel(centerData);
      console.log(newCenterData);
      await newCenterData.save();
      res.status(200).json({success:true,message:'New Center Added Successfully',data:newCenterData})
   }
   catch(error){
      res.status(500).json({success:false,message:'Center not added',error:error});
   }
   
   
}  

const updateVaccineCenter = async(req,res)=> {
   try{
      const id = req.params.id
      const updateData = req.body;
      const updatedCenterData = await centerModel.findByIdAndUpdate(id,updateData);
      return res.status(200).json({success:true,message:"Updated Successfully",data:updatedCenterData})
   }
   catch(error){
      return res.status(500).json({success:false,message:"Center not updated",error:error});
   }
}

const deleteCenterById = async(req,res) => {
   try{
      const id = req.params.id;
      const deleteCenter = await centerModel.findByIdAndDelete(id);
      return res.status(200).json({success:true,message:"Center deleted successfully",data:deleteCenter})
   }
   catch(error){
      return res.status(500).json({success:false,message:"Center not deleted",error:error});
   }
}

module.exports = {addNewVaccineCenter,updateVaccineCenter,getAllVaccineCenter,getVaccineCenterById,deleteCenterById};