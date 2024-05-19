const centerModel = require('../model/centerModel');

const getAllVaccineCenter = async(req,res) => {
   try{
      let active = req.query.active;
      // console.log(active)
      if(active === "undefined"){
         const allVaccineCenter = await centerModel.find();
         return res.status(200).json({success:true,message:'Retrived all the centers successfully',data:allVaccineCenter});
      }
      active = active==='true'?true:false;

      const allVaccineCenterByStatus = await centerModel.find({
         status:active
      });
      return res.status(200).json({success:true,message:'Retrived all the centers successfully 1',data:allVaccineCenterByStatus});
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
   const {name,email,phone,address,dosageCount,city,pincode,state} = req.body;
   // res.status(200).json({message:"working",data:{name,email,phone,address,dosageCount}})
   try{
      // console.log(req.body);
      const centerData = {
         name:name,
         email:email,
         phone:phone,
         address:{
            place:address,
            city:city,
            state:state,
            pincode:pincode,
         },
         dosageCount:dosageCount
      }
      console.log(centerData)
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
      // console.log(req.body);
      console.log(req.headers.authorization);
      const updatedCenterData = await centerModel.findByIdAndUpdate(id,updateData);
      // console.log(updatedCenterData);
      return res.status(200).json({success:true,message:"Updated Successfully",data:updateData})
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