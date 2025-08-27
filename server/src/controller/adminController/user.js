const userModel = require("../../Model/userModel")


const getAllUser = async (req,res)=>{
    try {

        const allUsers = await userModel.find().sort({ createdAt: -1 })
        return res.status(200).json({status:true , message:"successfully" , data:allUsers , count:allUsers.length})
        
    } catch (error) {
        return   res.status(500).json({ success: false, message: "internal server error" })
    }
}


const getUserById = async (req,res)=>{
    try {
        const User = await userModel.findById(req.params.id).sort({ createdAt: -1 })
        return res.status(200).json({status:true , message:"successfully" , data:User})
        
    } catch (error) {
        return   res.status(500).json({ success: false, message: "internal server error" })
    }
}


module.exports = {getAllUser , getUserById}